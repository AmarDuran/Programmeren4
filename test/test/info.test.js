var assert = require('assert');
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../index')
chai.should();
chai.use(chaiHttp);
const axios = require('axios');


const users = {
    id: '123',
    name: 'John Doe',
    email: 'johndoe@example.com'
};


describe('Server-info', function () {

    // Test case UC-201 Registreren als nieuwe gebruiker
    it('UC-201 Registreren als nieuwe gebruiker', (done) => {
        const testUser = {
            name: "Amar",
            email: "amar@bennie.nl",
            password: "geheimpje"
        }
        chai
            .request(server)
            .post('/api/user')
            .send(testUser)
            .end((err, res) => {
                res.body.should.be.an('object');
                res.body.should.has.property('name').equal(testUser.name);
                res.body.should.has.property('email').equal(testUser.email);
                res.body.should.has.property('id').to.be.a('number');

                chai.expect(res).to.have.status(201);
                done();
            })
    });

    // Test case TC-201-4 Gebruiker bestaat al
    it('TC-201-4 Gebruiker bestaat al', (done) => {
        const testUser = {
            name: "Amar",
            email: "amar@bennie.nl",
            password: "geheimpje"
        }
        chai
            .request(server)
            .post('/api/user')
            .send(testUser)
            .end((err, res) => {
                res.body.should.be.an('object');
                res.body.should.has.property('success');
                res.body.should.has.property('message');
                done();
            })
    });

    // Test case TC-202-1 Toon alle gebruikers (minimaal 2)
    it('TC-202-1 Toon alle gebruikers (minimaal 2)', (done) => {
        chai.request(server)
            .get('/api/user')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('array');
                res.body.should.have.length.greaterThan(1);
                done();
            });
    });

    // Test case TC-203-2 Gebruiker is ingelogd met geldig token
    it('returns user profile when logged in with valid token', (done) => {
        chai.request(server)
            .get('/api/user/profile')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.has.property('id')
                res.body.should.has.property('firstname')
                res.body.should.has.property('lastname')
                res.body.should.has.property('email')
                res.body.should.has.property('phoneNumber')
                res.body.should.has.property('street')
                res.body.should.has.property('city')
                done();
            });
    });

    // Test case TC-204-3 Gebruiker-ID bestaat
    it('TC-204-3 Gebruiker-ID bestaat', (done) => {
        const userId = 1;

        chai
            .request(server)
            .get(`/api/user/:userId`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.should.have.property('user');
                res.body.user.should.have.property('id').equal(userId);
                done();
            });
    });

    // Test case TC-206-4 Gebruiker succesvol verwijderd
    it('should delete user successfully', (done) => {
        chai
            .request(server)
            .delete('/api/user/1')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('message').equal('User deleted successfully');
                done();
            });
    });


});


