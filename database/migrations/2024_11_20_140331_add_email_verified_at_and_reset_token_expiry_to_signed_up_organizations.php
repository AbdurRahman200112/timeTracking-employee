<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddEmailVerifiedAtAndResetTokenExpiryToSignedUpOrganizations extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('signed_up_organizations', function (Blueprint $table) {
            $table->timestamp('email_verified_at')->nullable()->after('contact_email');
            $table->timestamp('reset_token_expiry')->nullable()->after('password'); // Ensure it is added after an existing column
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
            $table->dropColumn(['email_verified_at', 'reset_token_expiry']);
        });
    }
}
