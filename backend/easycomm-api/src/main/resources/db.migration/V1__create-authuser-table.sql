create sequence authusers_seq start 1 increment 50;

create table authusers (
    id int8 primary key unique not null,
    email varchar(255) unique not null,
    cpf varchar(14) not null,
    password varchar(255) not null,
    role varchar(255) not null,
    name varchar(255) not null
);