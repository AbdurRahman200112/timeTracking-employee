<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPasswordResetColumnsToAdminsTable extends Migration
{
    public function up()
    {
        Schema::table('admins', function (Blueprint $table) {
            $table->string('password_reset_token')->nullable()->after('verification_code'); // Reset token
            $table->timestamp('password_reset_token_expires_at')->nullable()->after('password_reset_token'); // Token expiry time
        });
    }

    public function down()
    {
        Schema::table('admins', function (Blueprint $table) {
            $table->dropColumn('password_reset_token');
            $table->dropColumn('password_reset_token_expires_at');
        });
    }
}
