import React from "react"
import { Route, Routes } from "react-router"
import { BrowserRouter } from "react-router-dom"
import Container from '@mui/material/Container'
import Home from "./components/Home"

export default function App() {

  return <BrowserRouter>
      <Container maxWidth={"xl"} sx={{ marginTop: 2 }}>
          <Routes>
              <Route path={"/"} element={<Home />}/>
          </Routes>
      </Container>
  </BrowserRouter>
}