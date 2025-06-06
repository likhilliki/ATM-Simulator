import express from 'express';
import serverless from 'serverless-http';
const express = required('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Express API working on Vercel!' });
});

module.exports = app;
module.exports.handler = serverless(app);
