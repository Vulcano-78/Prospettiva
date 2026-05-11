-- Aggiunge la colonna stripe_payment_intent_id alla tabella orders.
-- UNIQUE per garantire idempotenza dei webhook Stripe (Stripe può rispedire
-- lo stesso evento più volte): il secondo INSERT fallisce con 23505 e
-- viene gestito come "ordine già fulfillato" lato applicazione.

alter table public.orders
  add column if not exists stripe_payment_intent_id text;

create unique index if not exists orders_stripe_payment_intent_id_key
  on public.orders (stripe_payment_intent_id)
  where stripe_payment_intent_id is not null;
