const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {ToDo} = require('./../models/todo');

describe('POST /save-todos',() => {
    it('should save todo',(done)=>{
        request(app).post('/save-todo').send({text:""}).expect(400).end((err,res)=>{
            if(err){
                return done(err);
            }
            done();
        });
    });

    it('should return invalid data error',(done)=>{
        request(app).post('/save-todo').send({text:"a"}).expect(200).end((err,res)=>{
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

describe('DELETE /todo/:id',()=>{
    it('should delete the todo',(done)=>{
        var id = '5c77b04bf338330be4b6a019';
        request(app).delete(`/todo/${id}`).expect(200).end(done);
    });

    it('should return invalid id error',(done)=>{
        var id = '124';
        request(app).delete(`/todo/${id}`).expect(400).end(done);
    });

    it('should return not todo found error',(done)=>{
        var id = '5c77b04bf338330be4b6a010';
        request(app).delete(`/todo/${id}`).expect(404).end(done);
    });
});

describe('PATCH /todo/:id',()=>{
    it('should update Todo',(done)=>{
        var todoReq={
            text:"Task2 updated4",
            completed : true
        };
        request(app).patch('/todo/5c78cee693adc941c46e6148')
        .send({
            text:"Task2 updated4",
            completed : true
        })
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(todoReq.text);
            expect(res.body.todo.completed).toBe(todoReq.completed);
            expect(res.body.todo.completedAt).toBeA('number');
        })
        .end(done);
    });
});

describe('GET /users/me',()=>{
    it('should return 401 error',(done)=>{
        request(app).get('/users/me').set('x-auth','test').expect(401).expect((res)=>{
            console.log('body:',res.body);
            expect(res.body).toEqual({});
        }).end(done);
    });
}); 

describe('POST /user',()=>{
    it('should return invalid email id error',(done)=>{
        request(app).post('/user')
            .send({"email":"anc","password":"asbcdef"})
            .expect(400).end(done);
    });
});