#! /bin/bash

docker stop sudoku
docker rm sudoku
docker build -t sudoku .
docker run -d --name sudoku -p127.0.0.1:5061:80 -v /var/db:/var/db sudoku
