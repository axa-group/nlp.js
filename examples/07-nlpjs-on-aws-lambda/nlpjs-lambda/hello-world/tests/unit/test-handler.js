const chai = require('chai');
const app = require('../../app.js');

const { expect } = chai;
let event;
let context;

describe('Tests index', function () {
  it('verifies successful response', async () => {
    const result = await app.lambdaHandler(event, context);

    expect(result).to.be.an('object');
    expect(result.statusCode).to.equal(200);
    expect(result.body).to.be.an('string');

    const response = JSON.parse(result.body);

    expect(response).to.be.an('object');
    expect(response.message).to.be.equal('hello world');
    // expect(response.location).to.be.an("string");
  });
});
