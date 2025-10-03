import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('subscriptions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.uuid('team_id').references('id').inTable('teams').onDelete('CASCADE');
    table
      .enum('plan', ['free', 'starter', 'creator', 'pro', 'scale', 'business', 'enterprise'])
      .notNullable()
      .defaultTo('free');
    table.enum('billing_period', ['monthly', 'yearly']).defaultTo('monthly');
    table
      .enum('status', ['active', 'canceled', 'past_due', 'unpaid', 'trialing'])
      .defaultTo('active');
    table.string('stripe_customer_id').unique();
    table.string('stripe_subscription_id').unique();
    table.integer('credits_quota').notNullable().defaultTo(10000);
    table.integer('credits_used').notNullable().defaultTo(0);
    table.timestamp('credits_reset_at');
    table.timestamp('trial_ends_at');
    table.timestamp('current_period_start');
    table.timestamp('current_period_end');
    table.timestamp('canceled_at');
    table.jsonb('metadata').defaultTo('{}');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('payment_methods', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('stripe_payment_method_id').unique().notNullable();
    table.enum('type', ['card', 'bank_account']).notNullable();
    table.string('last4');
    table.string('brand');
    table.integer('exp_month');
    table.integer('exp_year');
    table.boolean('is_default').defaultTo(false);
    table.timestamps(true, true);
  });

  await knex.schema.createTable('invoices', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.uuid('team_id').references('id').inTable('teams').onDelete('CASCADE');
    table.string('stripe_invoice_id').unique();
    table.string('invoice_number');
    table.integer('amount_due').notNullable();
    table.integer('amount_paid').defaultTo(0);
    table.string('currency').defaultTo('usd');
    table.enum('status', ['draft', 'open', 'paid', 'void', 'uncollectible']).defaultTo('open');
    table.string('invoice_pdf_url');
    table.timestamp('due_date');
    table.timestamp('paid_at');
    table.jsonb('line_items');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('usage_records', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('team_id').references('id').inTable('teams').onDelete('CASCADE');
    table
      .enum('service', [
        'tts',
        'stt',
        'voice_cloning',
        'dubbing',
        'conversational_ai',
        'storage',
      ])
      .notNullable();
    table.integer('credits_consumed').notNullable();
    table.integer('characters_processed');
    table.integer('audio_seconds');
    table.jsonb('metadata');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // Create index for efficient usage queries
  await knex.schema.raw(`
    CREATE INDEX idx_usage_records_user_date 
    ON usage_records(user_id, created_at DESC);
  `);

  await knex.schema.raw(`
    CREATE INDEX idx_usage_records_team_date 
    ON usage_records(team_id, created_at DESC);
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('usage_records');
  await knex.schema.dropTableIfExists('invoices');
  await knex.schema.dropTableIfExists('payment_methods');
  await knex.schema.dropTableIfExists('subscriptions');
}
