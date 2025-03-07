<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;

class GenerateModel extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'raj:model';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $model_name = $this->ask("What is the name of the Model?");

        if(isset($model_name)){
            $model = $this->call("make:model",[
                'name'=> $model_name
            ]);
            $this->info('Model Created Successfully!');

            $this->createMigration($model_name);

            $controller_name = $model_name."Controller";

            $which_controller = $this->ask("Type 'admin' for creating the controller inside Admin!");
            if($which_controller == "admin"){
                //-r make a resource controller
                $this->call("make:controller",[
                    "name" => "Admin/{$controller_name}",
                    "-r"=> true,
                ]);

            }else{
                $this->call("make:controller",[
                    "name"=> $controller_name,
                    "-r"=>true,
                ]);
            }
            $this->info('Controller Created Successfully!');


        }
    }

    public function createMigration ($model_name){
        $migration_title = 'create_'.Str::plural(strtolower($model_name)).'_table';
        $this->call('make:migration',[
            'name'=> $migration_title,
            '--path'=> 'database/migrations',
        ]);
        $this->info('Migration Created Successfully!');
    }
}
