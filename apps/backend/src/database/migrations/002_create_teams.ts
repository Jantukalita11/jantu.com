import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('teams', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.string('slug').unique().notNullable();
    table.uuid('owner_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.text('description');
    table.string('logo_url');
    table.integer('max_seats').defaultTo(1);
    table.jsonb('settings').defaultTo('{}');
    table.timestamps(true, true);
    table.timestamp('deleted_at');
  });

  await knex.schema.createTable('team_members', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('team_id').notNullable().references('id').inTable('teams').onDelete('CASCADE');
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.enum('role', ['owner', 'admin', 'editor', 'viewer']).defaultTo('editor');
    table.timestamp('invited_at');
    table.uuid('invited_by').references('id').inTable('users');
    table.timestamp('joined_at');
    table.timestamps(true, true);
    table.unique(['team_id', 'user_id']);
  });

  await knex.schema.createTable('invitations', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('team_id').notNullable().references('id').inTable('teams').onDelete('CASCADE');
    table.string('email').notNullable();
    table.enum('role', ['admin', 'editor', 'viewer']).defaultTo('editor');
    table.uuid('invited_by').notNullable().references('id').inTable('users');
    table.string('token').unique().notNullable();
    table.enum('status', ['pending', 'accepted', 'expired']).defaultTo('pending');
    table.timestamp('expires_at').notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('invitations');
  await knex.schema.dropTableIfExists('team_members');
  await knex.schema.dropTableIfExists('teams');
}
