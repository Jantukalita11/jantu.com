import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('jobs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('project_id').references('id').inTable('projects').onDelete('SET NULL');
    table
      .enum('type', [
        'tts_generation',
        'voice_cloning',
        'dubbing',
        'transcription',
        'batch_processing',
      ])
      .notNullable();
    table.enum('status', ['queued', 'processing', 'completed', 'failed', 'canceled']).defaultTo('queued');
    table.enum('priority', ['low', 'normal', 'high']).defaultTo('normal');
    table.jsonb('input_data').notNullable();
    table.jsonb('output_data');
    table.text('error_message');
    table.integer('progress').defaultTo(0); // 0-100
    table.timestamp('started_at');
    table.timestamp('completed_at');
    table.integer('processing_time_ms');
    table.jsonb('metadata').defaultTo('{}');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('webhooks', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('url').notNullable();
    table.jsonb('events').notNullable(); // ['job.completed', 'job.failed', etc.]
    table.string('secret');
    table.boolean('active').defaultTo(true);
    table.integer('retry_count').defaultTo(3);
    table.timestamps(true, true);
  });

  await knex.schema.createTable('webhook_deliveries', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('webhook_id').notNullable().references('id').inTable('webhooks').onDelete('CASCADE');
    table.string('event_type').notNullable();
    table.jsonb('payload').notNullable();
    table.integer('response_status');
    table.text('response_body');
    table.enum('status', ['pending', 'delivered', 'failed']).defaultTo('pending');
    table.integer('attempt_count').defaultTo(0);
    table.timestamp('next_retry_at');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('api_keys', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('team_id').references('id').inTable('teams').onDelete('CASCADE');
    table.string('name').notNullable();
    table.string('key_hash').unique().notNullable();
    table.string('key_prefix').notNullable(); // First 8 chars for display
    table.jsonb('scopes').defaultTo('[]'); // ['tts', 'stt', 'voice_cloning', etc.]
    table.timestamp('last_used_at');
    table.timestamp('expires_at');
    table.boolean('active').defaultTo(true);
    table.timestamps(true, true);
  });

  await knex.schema.createTable('audit_logs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('SET NULL');
    table.uuid('team_id').references('id').inTable('teams').onDelete('SET NULL');
    table.string('action').notNullable();
    table.string('resource_type');
    table.uuid('resource_id');
    table.jsonb('changes');
    table.string('ip_address');
    table.string('user_agent');
    table.jsonb('metadata').defaultTo('{}');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // Create indexes for efficient queries
  await knex.schema.raw(`
    CREATE INDEX idx_jobs_user_status ON jobs(user_id, status);
    CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);
    CREATE INDEX idx_audit_logs_user ON audit_logs(user_id, created_at DESC);
    CREATE INDEX idx_audit_logs_team ON audit_logs(team_id, created_at DESC);
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('audit_logs');
  await knex.schema.dropTableIfExists('api_keys');
  await knex.schema.dropTableIfExists('webhook_deliveries');
  await knex.schema.dropTableIfExists('webhooks');
  await knex.schema.dropTableIfExists('jobs');
}
