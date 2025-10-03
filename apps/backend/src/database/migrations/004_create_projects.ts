import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('projects', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('team_id').references('id').inTable('teams').onDelete('CASCADE');
    table.string('name').notNullable();
    table.text('description');
    table
      .enum('type', [
        'tts',
        'voice_cloning',
        'dubbing',
        'stt',
        'conversational_ai',
        'multi_track',
      ])
      .notNullable();
    table.enum('status', ['draft', 'processing', 'completed', 'failed']).defaultTo('draft');
    table.jsonb('settings').defaultTo('{}');
    table.jsonb('metadata').defaultTo('{}');
    table.timestamps(true, true);
    table.timestamp('deleted_at');
  });

  await knex.schema.createTable('audio_files', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('project_id').references('id').inTable('projects').onDelete('CASCADE');
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('name').notNullable();
    table.string('original_filename');
    table.string('s3_key').notNullable();
    table.string('s3_url').notNullable();
    table.enum('file_type', ['audio', 'video', 'document']).notNullable();
    table.string('mime_type');
    table.integer('file_size');
    table.integer('duration_seconds');
    table.integer('sample_rate');
    table.integer('bit_rate');
    table.integer('channels');
    table.enum('status', ['uploading', 'processing', 'ready', 'failed']).defaultTo('uploading');
    table.jsonb('metadata').defaultTo('{}');
    table.timestamps(true, true);
    table.timestamp('deleted_at');
  });

  await knex.schema.createTable('tracks', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('project_id').notNullable().references('id').inTable('projects').onDelete('CASCADE');
    table.string('name').notNullable();
    table.integer('order').defaultTo(0);
    table.enum('type', ['voice', 'music', 'sfx', 'video']).notNullable();
    table.jsonb('settings').defaultTo('{}');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('segments', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('track_id').notNullable().references('id').inTable('tracks').onDelete('CASCADE');
    table.uuid('audio_file_id').references('id').inTable('audio_files').onDelete('SET NULL');
    table.text('text_content');
    table.integer('start_time_ms').notNullable();
    table.integer('end_time_ms').notNullable();
    table.integer('order').defaultTo(0);
    table.string('voice_id');
    table.jsonb('voice_settings').defaultTo('{}');
    table.jsonb('metadata').defaultTo('{}');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('voice_clones', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('team_id').references('id').inTable('teams').onDelete('CASCADE');
    table.string('name').notNullable();
    table.text('description');
    table.enum('type', ['instant', 'professional']).notNullable();
    table.enum('status', ['pending', 'training', 'ready', 'failed']).defaultTo('pending');
    table.string('model_id').unique();
    table.jsonb('training_samples').defaultTo('[]');
    table.integer('quality_score');
    table.jsonb('settings').defaultTo('{}');
    table.jsonb('metadata').defaultTo('{}');
    table.timestamps(true, true);
    table.timestamp('deleted_at');
  });

  await knex.schema.createTable('transcriptions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('audio_file_id').notNullable().references('id').inTable('audio_files');
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.text('text').notNullable();
    table.jsonb('words').defaultTo('[]'); // word-level timestamps
    table.jsonb('speakers').defaultTo('[]'); // speaker diarization
    table.string('language');
    table.float('confidence_score');
    table.enum('status', ['processing', 'completed', 'failed']).defaultTo('processing');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('transcriptions');
  await knex.schema.dropTableIfExists('voice_clones');
  await knex.schema.dropTableIfExists('segments');
  await knex.schema.dropTableIfExists('tracks');
  await knex.schema.dropTableIfExists('audio_files');
  await knex.schema.dropTableIfExists('projects');
}
