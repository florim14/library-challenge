import React from "react"
import Container from '@mui/material/Container'
import Home from "./components/Home"

export default function App() {

  return <Container maxWidth={"xl"} sx={{ marginTop: 2 }}>
      <Home />
  </Container>
}