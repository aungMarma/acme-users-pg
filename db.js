var pg = require('pg');

var client = new pg.Client(process.env.DATABASE_URL);

client.connect(function(err){
  if(err){
    console.log(err.message);
  }
});

function sync(cb){
  var sql = `
    DROP TABLE IF EXISTS users;
    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      name CHARACTER VARYING(255) UNIQUE,
      status VARCHAR
    );
  `;
  query(sql, null, function(err){
    if(err){
      return cb(err);
    }
    cb(null);
  });
}

function query(sql, params, cb){
  client.query(sql, params, cb);
}

function createUser(user, cb){
  query('insert into users (name, status) values ($1, $2) returning id, name, status', [ user.name, user.status ], function(err, result){
        if(err){
        return cb(err);
        }
        // console.log(result.rows);
        cb(null, result.rows); 
  }); 
}

function deleteUser(id, cb){
  query('delete from users where id = $1', [id], function(err, result){
        if(err){
            return cb(err);
        }
        cb(null);         // successfully deleted
  }); 
}

// demote manager
function updateUser(id, cb){   
  query("update users set status = 'user' where id = $1", [id], function(err, result){
    if(err){
      return cb(err);
    }
    cb(null);
  })
}

function getUsers(cb){
    query('select * from users', null, function(err, result){
        if(err){
            return cb(err);
        }
        // console.log(result.rows);
        cb(null, result.rows);

    })
}

function getManagers(cb){
   query('select * from users where status= $1',['manager'], function(err, result){
        if(err){
            return cb(err);
        }
        // console.log(result.rows);
        cb(null, result.rows);

    })
}

function seed(cb){
  createUser({ name: 'Eric', status: 'manager'}, function(err, id){
        if(err){
            return cb(err);
        }
        createUser({ name: 'Aung', status: 'user'}, function(err, id){
            if(err){
                return cb(err);
            }
            createUser({ name: 'Wasif', status: 'user'}, function(err, id){
                if(err){
                    return cb(err);
                }
                cb(null);
            });
        });
    });

}

module.exports = {
  sync,
  seed,
  getUsers,
  createUser,
  deleteUser,
  getManagers,
  updateUser,   
};
