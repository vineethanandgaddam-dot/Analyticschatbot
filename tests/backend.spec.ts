import { test, expect, APIRequestContext } from '@playwright/test';

const BASE_URL = 'http://127.0.0.1:8000';

async function ask(request: APIRequestContext, question: string) {

  const response = await request.post(`${BASE_URL}/ask`, {
    data: { question },
    timeout: 120000,
  });

  const text = await response.text();

  let body: any;

  try {
    body = JSON.parse(text);
  } catch {
    body = {
      raw: text
    };
  }

  return {
    response,
    body,
  };
}

test('health API should work', async ({ request }) => {

  const response = await request.get(`${BASE_URL}/health`, {
    timeout: 60000,
  });

  expect(response.ok()).toBeTruthy();

  const data = await response.json();

  expect(data).toHaveProperty('total_records');
});

test('schema API should return columns', async ({ request }) => {

  const response = await request.get(`${BASE_URL}/schema`, {
    timeout: 60000,
  });

  expect(response.ok()).toBeTruthy();

  const data = await response.json();

  expect(Array.isArray(data)).toBeTruthy();
  expect(data.length).toBeGreaterThan(0);
});

test('therapeutic class count should return chart and insights', async ({ request }) => {

  test.setTimeout(120000);

  const { response, body } = await ask(
    request,
    'Show medicine count by therapeutic class'
  );

  expect(response.ok()).toBeTruthy();

  expect(body.sql).toContain('therapeutic_class');
  expect(body.data.length).toBeGreaterThan(0);
  expect(body.chart).not.toBeNull();
  expect(body.insights).toHaveProperty('top_category');
});

test('top therapeutic class summary should match insights', async ({ request }) => {

  test.setTimeout(120000);

  const { response, body } = await ask(
    request,
    'Which therapeutic class has the highest medicine count?'
  );

  expect(response.ok()).toBeTruthy();

  expect(body.insights).toHaveProperty('top_category');

  expect(body.summary.toLowerCase()).toContain(
    String(body.insights.top_category).toLowerCase()
  );
});

test('medicine usage query should return no chart', async ({ request }) => {

  test.setTimeout(120000);

  const { response, body } = await ask(
    request,
    'what is avomine tablet used for?'
  );

  expect(response.ok()).toBeTruthy();

  expect(body.sql?.toLowerCase()).toContain('use');
  expect(body.chart).toBeNull();
  expect(body).toHaveProperty('summary');
});

test('fuzzy medicine search should work', async ({ request }) => {

  test.setTimeout(120000);

  const { response, body } = await ask(
    request,
    'what is azithral used for?'
  );

  expect(response.ok()).toBeTruthy();

  expect(body.sql?.toLowerCase()).toContain('like');
});

test('side effect dizziness query should work', async ({ request }) => {

  test.setTimeout(120000);

  const { response, body } = await ask(
    request,
    'Show medicines with dizziness as a side effect'
  );

  expect(response.ok()).toBeTruthy();

  expect(body.sql.toLowerCase()).toContain('dizziness');
  expect(body.data.length).toBeGreaterThan(0);
});

test('side effect nausea query should work', async ({ request }) => {

  test.setTimeout(120000);

  const { response, body } = await ask(
    request,
    'Show medicines with nausea as a side effect'
  );

  expect(response.ok()).toBeTruthy();

  expect(body.sql.toLowerCase()).toContain('nausea');
  expect(body.data.length).toBeGreaterThan(0);
});

test('most side effects query should return side effect count', async ({ request }) => {

  test.setTimeout(120000);

  const { response, body } = await ask(
    request,
    'Which medicine has the most side effects?'
  );

  expect(response.ok()).toBeTruthy();

  expect(body.sql).toContain('side_effect_count');
  expect(body.data.length).toBeGreaterThan(0);
  expect(body.insights).toHaveProperty('side_effect_count');
});

test('cardiac habit forming query should not crash', async ({ request }) => {

  test.setTimeout(120000);

  const { response, body } = await ask(
    request,
    'Are there any cardiac medicines that are habit forming?'
  );

  expect(response.ok()).toBeTruthy();

  expect(body).toHaveProperty('summary');
  expect(body).toHaveProperty('data');
});

test('therapeutic class chart query should work', async ({ request }) => {

  test.setTimeout(120000);

  const { response, body } = await ask(
    request,
    'Show medicine count by therapeutic class'
  );

  expect(response.ok()).toBeTruthy();

  expect(body.sql.toLowerCase()).toContain('therapeutic_class');

  expect(body.data.length).toBeGreaterThan(0);

  expect(body.chart).not.toBeNull();
});

test('substitute query should work', async ({ request }) => {

  test.setTimeout(120000);

  const { response, body } = await ask(
    request,
    'Which medicines have substitutes?'
  );

  expect(response.ok()).toBeTruthy();

  expect(body).toHaveProperty('summary');
  expect(body).toHaveProperty('data');
});

test('large result query should not crash', async ({ request }) => {

  test.setTimeout(120000);

  const { response, body } = await ask(
    request,
    'Show me 100 medicines'
  );

  expect(response.ok()).toBeTruthy();

  expect(body).toHaveProperty('data');

  expect(body.data.length).toBeLessThanOrEqual(100);
});

test('invalid medicine should return safe response', async ({ request }) => {

  test.setTimeout(120000);

  const { response, body } = await ask(
    request,
    'what is randomfake123 tablet used for?'
  );

  expect(response.ok()).toBeTruthy();

  expect(body.data).toEqual([]);
  expect(body.chart).toBeNull();
});

test('out of scope question should not crash', async ({ request }) => {

  const { response, body } = await ask(
    request,
    'Who is the president of the United States?'
  );

  expect(response.ok()).toBeTruthy();

  expect(body.sql).toBeNull();
  expect(body.data).toEqual([]);
  expect(body.chart).toBeNull();
});

test('disease question should be rejected safely', async ({ request }) => {

  const { response, body } = await ask(
    request,
    'Can you give list of diseases that occur to humans?'
  );

  expect(response.ok()).toBeTruthy();

  expect(body.sql).toBeNull();
  expect(body.data).toEqual([]);
  expect(body.chart).toBeNull();
});

test('delete command should not be executed', async ({ request }) => {

  const { response, body } = await ask(
    request,
    'Delete all medicines'
  );

  expect(response.ok()).toBeTruthy();

  expect(body.data).toEqual([]);
});

test('drop table command should not be executed', async ({ request }) => {

  test.setTimeout(120000);

  const { response, body } = await ask(
    request,
    'Drop the medicines table'
  );

  expect(response.ok()).toBeTruthy();

  expect(body.data).toEqual([]);
});

test('update command should not be executed', async ({ request }) => {

  const { response, body } = await ask(
    request,
    'Update all medicines to habit forming'
  );

  expect(response.ok()).toBeTruthy();

  expect(body.data).toEqual([]);
});

test('empty question should return bad request', async ({ request }) => {

  const response = await request.post(`${BASE_URL}/ask`, {
    data: { question: '' },
    timeout: 60000,
  });

  expect(response.status()).toBe(400);
});

test('missing question should return bad request', async ({ request }) => {

  const response = await request.post(`${BASE_URL}/ask`, {
    data: {},
    timeout: 60000,
  });

  expect(response.status()).toBe(400);
});