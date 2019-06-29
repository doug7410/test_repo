<?php

namespace App\Console\Commands;

use App\Jobs\GoodRxDrugIdJob;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Console\Command;

class ScrapeGoodrxCommand extends Command
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
    protected $description = 'Scrape GoodRX';
    private $baseUrls;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
        $this->baseUrls = [
            'http://drug_scraper_puppeteer-local:3000',
            'http://drug_scraper_puppeteer-local-2:3000',
            'http://drug_scraper_puppeteer-local-3:3000',
//            'http://drug_scraper_puppeteer-local-5:3000',
//            'http://drug_scraper_puppeteer-local-6:3000',
//            'http://drug_scraper_puppeteer-local-7:3000',
//            'http://drug_scraper_puppeteer-local-8:3000',
//            'http://drug_scraper_puppeteer-local-9:3000',
//            'http://drug_scraper_puppeteer-local-10:3000'
        ];
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $goodrxPullTable = config('scrape_tables.goodrx.pull_table');
        $drugs = \DB::table($goodrxPullTable)->whereNull('unavailable')->get()->toArray();

        foreach ($drugs as $drug) {
            $this->info('Dispatching  GoodRxDrugId Job. Drug ID: ' . $drug->id);
            GoodRxDrugIdJob::dispatch($drug, $this->getNextUrl())->onQueue('goodrx');
        }

        return;
    }

    private function getNextUrl()
    {
        $nextUrl = array_shift($this->baseUrls);
        array_push($this->baseUrls, $nextUrl);
        return $nextUrl;
    }
}
