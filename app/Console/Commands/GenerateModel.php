<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class GenerateModel extends Command
{

    protected $signature = 'raj:model';


    protected $description = 'Command description';



    public function handle()
    {
        $model_name = $this->ask("What is the name of the Model?");

        if (isset($model_name)) {
            // Generating TITLE and SUBTITLE for list.tsx and edit-add.tsx
            $model_title =  Str::plural($model_name);
            $model_subtitle =  Str::plural(strtolower($model_name));

            //Here if model_name is Blog, $model_title will return Blogs and $model_subtitle will return blogs


            //----Creating a model using stubs
            $model_template = file_get_contents(base_path() . '/app/Stubs/Model.stub');
            $model_variables = [
                "MODEL" => $model_name,
            ];
            foreach ($model_variables as $key => $value) {
                $model_template = str_replace("{{{$key}}}", $value, $model_template);
            }

            //where to store the model
            $model_path = base_path() . '/app/Models';

            //storing the model
            file_put_contents($model_path . "/$model_name.php", $model_template);

            $this->info('Model Created Successfully!');
            //----End of creating model using stubs

            $this->createMigration($model_name);

            //----Creating Request
            $request_name = "Store" . $model_name . "Request";
            $this->call("make:request", [
                "name" => $request_name,
            ]);
            $this->info("Request Created Successfully!");
            //----End of creating Request

            //----Creating Custom Controller
            $controller_name = $model_name . "Controller";

            $which_controller = $this->ask("Type 'admin' for creating the controller inside Admin!");

            if ($which_controller == "admin") {
                $controller_template = file_get_contents(base_path() . "/app/Stubs/Controller.stub");
                $controller_variables = [
                    "CONTROLLER" => $controller_name,
                    "MODEL" => $model_name,
                    "REQUEST" => $request_name
                ];

                foreach ($controller_variables as $key => &$value) {
                    $controller_template = str_replace("{{{$key}}}", $value, $controller_template);
                }

                //where to store the controller
                $controller_path = base_path() . '/app/Http/Controllers/Admin';

                //storing the controller
                file_put_contents($controller_path . "/$controller_name.php", $controller_template);

                //Creating Route in web.php
                $this->createRoute($model_subtitle, $controller_name, $is_admin = true);
            } else {
                $this->call("make:controller", [
                    "name" => "Front/$controller_name",
                    "-r" => true,
                ]);

                //Creating Route in web.php
                $this->createRoute($model_subtitle, $controller_name, $is_admin = false);
            }
            $this->info('Controller Created Successfully!');
            //----End of creating custom controller

            //Making Folder and Files for dashboard
            $make_folder = $this->ask('Do you want to make Folders and Files for dashboard? ("yes" or "no")');

            if ($make_folder == "y" || $make_folder == "yes" || $make_folder == "Yes" || $make_folder == "YES") {
                $this->createListForDashboard($model_title, $model_name, $model_subtitle);
                $this->createEditAddForDashboard($model_title, $model_name, $model_subtitle);
            }

            //Making Permissions 
            $make_permissions = $this->ask('Do you want to make permission (EDIT,ADD,UPDATE,DELETE)? ("yes" or "no")');
            if ($make_permissions == "y" || $make_permissions == "yes" || $make_permissions == "Yes" || $make_permissions == "YES") {
                $this->createPermissions($model_subtitle);
            }
        }
    }

    public function createMigration($model_name)
    {
        $migration_title = 'create_' . Str::plural(strtolower($model_name)) . '_table';
        $this->call('make:migration', [
            'name' => $migration_title,
            '--path' => 'database/migrations',
        ]);
        $this->info('Migration Created Successfully!');
    }

    public function createListForDashboard($model_title, $model_name, $model_subtitle)
    {
        $file_path = base_path() . "/resources/js/pages/admin/" . $model_subtitle;
        if (file_exists($file_path)) {
            $this->info('Directory Already Exists');
        } else {
            mkdir(base_path() . "/resources/js/pages/admin/" . $model_subtitle);
            $list_template = file_get_contents(base_path() . "/app/Stubs/Module/list.stub");
            $list_variables = [
                "MODEL" => $model_name,
                "TITLE" => $model_title,
                "SUBTITLE" => $model_subtitle,
            ];

            foreach ($list_variables as $key => $value) {
                $list_template = str_replace("{{{$key}}}", $value, $list_template);
            }
            $list_path = base_path() . '/resources/js/pages/admin/' . $model_subtitle;
            file_put_contents($list_path . "/list.tsx", $list_template);
            $this->info('Listing File Created Successfully!');
        }
    }
    public function createEditAddForDashboard($model_title, $model_name, $model_subtitle)
    {

        $edit_template = file_get_contents(base_path() . "/app/Stubs/Module/edit-add.stub");
        $edit_variables = [
            "MODEL" => $model_name,
            "TITLE" => $model_title,
            "SUBTITLE" => $model_subtitle,
        ];

        foreach ($edit_variables as $key => $value) {
            $edit_template = str_replace("{{{$key}}}", $value, $edit_template);
        }
        $edit_path = base_path() . '/resources/js/pages/admin/' . $model_subtitle;
        file_put_contents($edit_path . "/edit-add.tsx", $edit_template);
        $this->info('Edit Add File Created Successfully!');
    }

    public function createRoute($model_subtitle, $controller_name, $is_admin)
    {
        $route_path = base_path() . '/routes/web.php';
        $new_Route_content = <<<ROUTE
    Route::get('$model_subtitle/paginate',[$controller_name::class, 'paginate'])->name('$model_subtitle.paginate');
    Route::resource('$model_subtitle', {$controller_name}::class);

    ROUTE;

        $route_content = file_get_contents($route_path);

        if ($is_admin) {
            $import_statement = "use App\\Http\\Controllers\\Admin\\{$controller_name};";
        } else {
            $import_statement = "use App\\Http\\Controllers\\Front\\{$controller_name};";
        }

        if (strpos($route_content, $import_statement) === false) {
            $import_position = strpos($route_content, "<?php") + 5;
            $route_content = substr_replace($route_content, "\n$import_statement", $import_position, 0);
        }

        if ($is_admin) {
            $admin_group_start = strpos($route_content, "Route::middleware(['auth'])->prefix('admin')->group(function () {");
            if ($admin_group_start !== false) {
                $admin_group_end = strpos($route_content, "});", $admin_group_start);
                if ($admin_group_end !== false) {
                    $insert_position = $admin_group_end;
                    $route_content = substr_replace($route_content, "\n$new_Route_content", $insert_position, 0);
                }
            }
        } else {
            $route_content .= "\n$new_Route_content";
        }

        file_put_contents($route_path, $route_content);

        $this->info("Routes for $model_subtitle added to routes/web.php");
    }

    public function createPermissions($permission_model)
    {
        $permission_model = ucwords($permission_model);
        $permissions = [
            'Edit ' . $permission_model,
            'Add ' . $permission_model,
            'Update ' . $permission_model,
            'Delete ' . $permission_model
        ];
        
        foreach ($permissions as $permission) {
            $existingPermission = Permission::where('name', $permission)->first();
    
            if (!$existingPermission) {
                $newPermission = Permission::create([
                    "name" => $permission,
                    'guard_name' => 'web'
                ]);
    
            }
        }
    
        $this->info('Permissions Created Successfully!');
    }
}
