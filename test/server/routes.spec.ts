/*
 * MIT License
 *
 * Copyright (c) 2019 Markus Graube <markus.graube@tu.dresden.de>,
 * Chair for Process Control Systems, Technische Universität Dresden
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import * as request from 'supertest';
import {Manager} from '../../src/model/Manager';
import Routes from '../../src/server/routes';
import {Server} from '../../src/server/server';

describe('Routes', () => {
    let app;

    before(() => {
        const appServer = new Server(new Manager());
        app = appServer.app;
    });

    it('should give code 404 for not existing routes', (done) => {
        request(app).get('/api/notExisting')
            .expect(404, done);
    });


    context('#coreRoutes', () => {

        context('autoReset', () => {

            it('should provide autoreset', (done) => {
                request(app).get('/api/autoReset')
                    .expect('Content-Type', /json/)
                    .expect('Content-Length', '18')
                    .expect('{"autoReset":true}')
                    .expect(200, done);
            });

            it('should modify autoreset', (done) => {
                request(app).post('/api/autoReset')
                    .send({autoReset: 'false'})
                    .expect('{"autoReset":false}')
                    .expect(200, done);
            });

            it('should modify autoreset 2', (done) => {
                request(app).post('/api/autoReset')
                    .send({autoReset: 0})
                    .expect('{"autoReset":false}')
                    .expect(200, done);
            });

            it('should modify autoreset 3', (done) => {
                request(app).post('/api/autoReset')
                    .send({autoReset: 'blub'})
                    .expect('{"autoReset":false}')
                    .expect(200, done);
            });

            it('should modify autoreset 4', (done) => {
                request(app).post('/api/autoReset')
                    .send({autoReset: 'true'})
                    .expect('{"autoReset":true}')
                    .expect(200, done);
            });

            it('should modify autoreset 5', (done) => {
                request(app).post('/api/autoReset')
                    .send({autoReset: '1'})
                    .expect('{"autoReset":true}')
                    .expect(200, done);
            });

            it('should modify autoreset 6', (done) => {
                request(app).post('/api/autoReset')
                    .send({autoReset: true})
                    .expect('{"autoReset":true}')
                    .expect(200, done);
            });

            it('should modify autoreset 7', (done) => {
                request(app).post('/api/autoReset')
                    .send({autoReset: 1})
                    .expect('{"autoReset":true}')
                    .expect(200, done);
            });

            it('should modify autoreset 8', (done) => {
                request(app).post('/api/autoReset')
                    .send({autoReset: 'TRUE'})
                    .expect('{"autoReset":true}')
                    .expect(200, done);
            });

        });

        it('should provide version', (done) => {
            request(app).get('/api/version')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

        it('should provide meta information', (done) => {
            request(app).get('/api/')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

        context('logs', () => {

            it('should provide logs', (done) => {
                request(app).get('/api/logs')
                    .expect('Content-Type', /json/)
                    .expect(200, done);
            });

            it('should provide logs 2', (done) => {
                request(app).get('/api/logs.json')
                    .expect('Content-Type', /json/)
                    .expect(200, done);
            });

            it('should provide service logs', (done) => {
                request(app).get('/api/logs/services')
                    .expect('Content-Type', /json/)
                    .expect(200, done);
            });

            it('should provide service logs 2', (done) => {
                request(app).get('/api/logs/services.json')
                    .expect('Content-Type', /json/)
                    .expect(200, done);
            });

            it('should provide variables logs', (done) => {
                request(app).get('/api/logs/variables')
                    .expect('Content-Type', /json/)
                    .expect(200, done);
            });

            it('should provide service logs 2', (done) => {
                request(app).get('/api/logs/variables.json')
                    .expect('Content-Type', /json/)
                    .expect(200, done);
            });

        });
    });

    context('#moduleRoutes', () => {
        it('should provide version', (done) => {
            request(app).get('/api/module')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });
});