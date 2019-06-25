<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class Goodrx extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'goodrx';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $drugs = \DB::table('drug_pull_goodrx')->get()->toArray();
        dd($drugs);
    }
}
