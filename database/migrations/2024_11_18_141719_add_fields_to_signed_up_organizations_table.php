<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldsToSignedUpOrganizationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('signed_up_organizations', function (Blueprint $table) {
            $table->string('manager_name')->nullable(); // Added manager name
            $table->string('manager_phone')->nullable(); // Added manager phone number
            $table->string('website')->nullable(); // Added website URL
            $table->string('address')->nullable(); // Added address field
            $table->string('address2')->nullable(); // Added secondary address field
            $table->string('state')->nullable(); // Added state field
            $table->string('city')->nullable(); // Added city field
            $table->string('country')->nullable(); // Added country field
            $table->string('zip_code')->nullable(); // Added zip code field
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('signed_up_organizations', function (Blueprint $table) {
            $table->dropColumn([
                'manager_name', 
                'manager_phone', 
                'website', 
                'address', 
                'address2', 
                'state', 
                'city', 
                'country', 
                'zip_code'
            ]);
        });
    }
}
