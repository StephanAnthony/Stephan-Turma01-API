import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';

describe('Company API', () => {
  const baseUrl = 'https://api-desafio-qa.onrender.com/company';

  pactum.request.setDefaultTimeout(30000);

  describe('CREATE COMPANY', () => {
    it('should create a new company', async () => {
      const companyData = {
        name: 'Empresa Exemplo',
        cnpj: '12345678000195',
        state: 'São Paulo',
        city: 'São Paulo',
        address: 'Rua Exemplo, 123',
        sector: 'Tecnologia'
      };

      await pactum
        .spec()
        .post(baseUrl)
        .withJson(companyData)
        .expectStatus(StatusCodes.CREATED)
        .expectJsonLike({
          id: expect.any(Number),
          name: companyData.name,
          cnpj: companyData.cnpj,
          state: companyData.state,
          city: companyData.city,
          address: companyData.address,
          sector: companyData.sector,
          products: [],
          employees: [],
          services: []
        });
    });

    it('should return an error for invalid CNPJ', async () => {
      const invalidCompanyData = {
        name: 'Empresa Invalida',
        cnpj: 'invalid-cnpj',
        state: 'São Paulo',
        city: 'São Paulo',
        address: 'Rua Invalida, 123',
        sector: 'Tecnologia'
      };

      await pactum
        .spec()
        .post(baseUrl)
        .withJson(invalidCompanyData)
        .expectStatus(StatusCodes.BAD_REQUEST)
        .expectJsonLike({
          errors: [
            {
              msg: "CNPJ deve ter 14 dígitos",
              path: "cnpj"
            },
            {
              msg: "CNPJ deve conter apenas números",
              path: "cnpj"
            }
          ]
        });
    });

    it('should return an error for empty name', async () => {
      const invalidCompanyData = {
        name: '',
        cnpj: '12345678000195',
        state: 'São Paulo',
        city: 'São Paulo',
        address: 'Rua Invalida, 123',
        sector: 'Tecnologia'
      };

      await pactum
        .spec()
        .post(baseUrl)
        .withJson(invalidCompanyData)
        .expectStatus(StatusCodes.BAD_REQUEST)
        .expectJsonLike({
          errors: [
            {
              msg: "Nome é obrigatório",
              path: "name"
            }
          ]
        });
    });
  });
});
