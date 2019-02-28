const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {ToDo} = require('./../models/todo');

describe('POST /save-todos',() => {
    it('should save todo',(done)=>{
        var text ="Testing Task";
        request(app).post('/save-todo').send({text}).expect(200).expect((res)=>{
            expect(res.body.text).toBe(text);
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            done();
        });
    });

    it('should return invalid data error',(done)=>{
        request(app).post('/save-todo').send({text:""}).expect(400).end((err,res)=>{
            if(err){
                return done(err);
            }
            done();
        });
    });
});

describe('GET get-todos',()=>{
    it('should return all todos',(done)=>{
        request(app).get('/get-todos').expect(200).end(done);
    });
});

describe('GET /todo/:id',()=>{
    it('should return the todo',(done)=>{
        var id ='5c766a576114031c5c2ae4bc';
        request(app).get(`/todo/${id}`).expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toEqual("task1")
            });
        done();
    });

    it('should return 400 invalid id',(done)=>{
        var id ='5c766a576114031c5c2ae4bc1';
        request(app).get(`/get-todo/${id}`).expect(400)
            .expect((res)=>{
               
                expect(res.body.msg).toEqual("Todo Id is invalid")
            }).end(done);
        
    });

    it('should return 400 todo not found',(done)=>{
        var id ='5c766a576114031c5c2ae4bd';
        request(app).get(`/get-todo/${id}`).expect(404)
            .expect((res)=>{
               
                expect(res.body.msg).toEqual("Todo not found")
            }).end(done);
        
    });
});