<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

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
            
        }
    }
}
