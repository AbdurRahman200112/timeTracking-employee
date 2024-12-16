<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSignedUpOrganizationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('signed_up_organizations', function (Blueprint $table) {
            $table->id();
            $table->date('date_signed_up');
            $table->string('company_name');
            $table->string('contact_email');
            $table->string('contact_phone');
            $table->enum('monthly_plan', ['Pending', 'Active', 'Expired'])->default('Pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('signed_up_organizations');
    }
}
