import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email').unique().notNullable();
    table.string('password_hash');
    table.string('name');
    table.string('avatar_url');
    table.enum('role', ['user', 'admin']).defaultTo('user');
    table.boolean('email_verified').defaultTo(false);
    table.string('email_verification_token');
    table.timestamp('email_verified_at');
    table.boolean('mfa_enabled').defaultTo(false);
    table.string('mfa_secret');
    table.timestamp('last_login_at');
    table.string('last_login_ip');
    table.jsonb('metadata').defaultTo('{}');
    table.timestamps(true, true);
    table.timestamp('deleted_at');
  });

  await knex.schema.createTable('oauth_accounts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.enum('provider', ['google', 'github', 'apple']).notNullable();
    table.string('provider_user_id').notNullable();
    table.jsonb('profile_data');
    table.string('access_token');
    table.string('refresh_token');
    table.timestamp('expires_at');
    table.timestamps(true, true);
    table.unique(['provider', 'provider_user_id']);
  });

  await knex.schema.createTable('sessions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('token').unique().notNullable();
    table.string('refresh_token').unique();
    table.string('ip_address');
    table.string('user_agent');
    table.timestamp('expires_at').notNullable();
    table.timestamp('last_activity_at');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('sessions');
  await knex.schema.dropTableIfExists('oauth_accounts');
  await knex.schema.dropTableIfExists('users');
}
