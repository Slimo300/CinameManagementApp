db = db.getSiblingDB("auth");

db.users.insertOne({
    email: "admin@net.pl",
    password: "74d39f5dfe2c7c5608e7d187b73236aec49f0dc089e48fcb8c01909be3a1d238ad7ae716e1eef6b98a2ffbae14c59e8f21f1af9068b8b7633def69e02f53a3d1.bc4a1cb1eb9ab65b",
    isAdmin: true,
    __v: 0
})