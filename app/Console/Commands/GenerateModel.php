<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;

class GenerateModel extends Command
{

    protected $signature = 'raj:model';


    protected $description = 'Command description';


    public function handle()
    {
        $model_name = $this->ask("What is the name of the Model?");

        if (isset($model_name)) {
            // $model = $this->call("make:model",[
            //     'name'=> $model_name
            // ]);

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
                $request_name = "Store".$model_name."Request";
                $this->call("make:request",[
                    "name"=> $request_name,
                ]);
                $this->info("Request Created Successfully!");
            //----End of creating Request

            //----Creating Custom Controller
                $controller_name = $model_name . "Controller";

                $which_controller = $this->ask("Type 'admin' for creating the controller inside Admin!");

                if ($which_controller == "admin") {
                    $controller_template = file_get_contents(base_path() . "/app/Stubs/Controller.stub");
                    $controller_variables = [
                        "CONTROLLER"=> $controller_name,
                        "MODEL"=>$model_name,
                        "REQUEST"=> $request_name
                    ];

                    foreach($controller_variables as $key=>&$value) {
                        $controller_template = str_replace("{{{$key}}}", $value, $controller_template);
                    }

                    //where to store the controller
                    $controller_path = base_path().'/app/Http/Controllers/Admin';
                    
                    //storing the controller
                    file_put_contents($controller_path . "/$controller_name.php", $controller_template) ;

                } else {
                    $this->call("make:controller", [
                        "name" => "Front/$controller_name",
                        "-r" => true,
                    ]);
                }
                $this->info('Controller Created Successfully!');
            //----End of creating custom controller
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
}
