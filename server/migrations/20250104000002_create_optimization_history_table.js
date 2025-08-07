export function up(knex) {
  return knex.schema.createTable("optimization_history", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("user_id");
    table.text("original_prompt").notNullable();
    table.text("optimized_prompt").notNullable();
    table.string("strategy").notNullable();
    table.jsonb("scores").notNullable();
    table.jsonb("analysis").notNullable();
    table.jsonb("alternatives");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    
    table.index("user_id");
    table.index("created_at");
  });
}

export function down(knex) {
  return knex.schema.dropTable("optimization_history");
}