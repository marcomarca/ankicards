const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/auth');
const db = require('../db');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Auth Endpoints', () => {
  // Limpiar la base de datos antes de cada prueba
  beforeEach((done) => {
    db.run('DELETE FROM ankicards', () => {
      done();
    });
  });

  // Pruebas de registro
  describe('POST /auth/register', () => {
    it('debería registrar un usuario con éxito', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          username: 'testuser',
          password: 'password123',
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Usuario registrado con éxito');
    });

    it('debería devolver un error si faltan datos', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          username: 'testuser',
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', 'Faltan datos');
    });

    it('debería devolver un error si el nombre de usuario ya existe', async () => {
      // Primero, registrar un usuario
      await request(app)
        .post('/auth/register')
        .send({
          username: 'testuser',
          password: 'password123',
        });

      // Intentar registrar el mismo usuario de nuevo
      const res = await request(app)
        .post('/auth/register')
        .send({
          username: 'testuser',
          password: 'password123',
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', 'Usuario ya existe');
    });
  });

  // Pruebas de inicio de sesión
  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Crear un usuario para las pruebas de inicio de sesión
      await request(app)
        .post('/auth/register')
        .send({
          username: 'testuser',
          password: 'password123',
        });
    });

    it('debería iniciar sesión con éxito', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          username: 'testuser',
          password: 'password123',
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Login exitoso');
      expect(res.body).toHaveProperty('token');
    });

    it('debería devolver un error con credenciales no válidas (usuario no encontrado)', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          username: 'wronguser',
          password: 'password123',
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', 'Credenciales inválidas');
    });

    it('debería devolver un error con credenciales no válidas (contraseña incorrecta)', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword',
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', 'Credenciales inválidas');
    });
  });
});