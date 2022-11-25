describe('API - Profile', () => {
    context('todos os perfis', () => {
        it('valida a API de perfis', () => {

            cy.log('Teste de Texto')
            cy.request({ //requisicao para uma api com metodo get
                method: 'GET',
                url: '/api/profile'
            }).then(respostaAPI => { //pegando resposta de um comando
                expect(respostaAPI.status).to.equal(200) //Validando status code (1 assert)
                expect(respostaAPI.duration).to.be.lessThan(10000) //validando os segundos (2 assert)
                expect(respostaAPI.body[0].status).to.eq('Gerente de Testes')
                expect(respostaAPI.body[0].user.name).to.eq('Pedro Guerra')
                expect(respostaAPI.body[0].skills[0]).to.eq('Cypress')
                expect(respostaAPI.body[0].skills).to.have.lengthOf(1)
                expect(respostaAPI.body[0].date).to.not.be.null
                expect(respostaAPI.headers['x-powered-by']).to.eq('Express')

            })
        });

    });

    context('perfil específico', () => {
        it('seleciona um usuario inválido', () => {
            cy.request({
                method: 'GET',
                url: '/api/profile/user/1',
                failOnStatusCode: false
            }).then(respostaAPI => {
                expect(respostaAPI.status).to.eq(404)
                expect(respostaAPI.body.errors[0].msg).to.eq('Perfil não encontrado')
            })
        });
        it('valida um usuário válido', () => {
            let usuarioId = '637d72b11fb5cb0015a02258'

            cy.request({
                method: 'GET',
                url: `/api/profile/user/${usuarioId}`
            }).then(({ status, body }) => {
                expect(status).to.eq(200)
                expect(body.user.name).to.eq('Pedro Guerra')
            })
            
        });
        it.only('valida um usuário valido buscando na base', () => {

            let usuarioId = ''

            cy.request({
                method: 'GET',
                url: '/api/profile'
            }).then (({ body }) => {
                usuarioId = body[1].user._id
                cy.request({
                    method: 'GET',
                    url: `/api/profile/user/${body[1].user._id}`
                }).then(({ status, body }) => {
                    expect(status).to.eq(200)
                    expect(body.status).to.eq('Outro')
                })
                
            })
        });
    });
});