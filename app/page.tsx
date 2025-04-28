import Image from "next/image";
import { Container, Row, Col } from 'reactstrap';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tribes of Men',
  description: 'An aethetic finder for men and all masc folx'
  
};

export default function Home() {
  const envTest = process.env.DB_HOST;
  // console.log(envTest);
  // console.log(`Testing the console.`)
  return (
    <Container fluid >
      <Row className="remove-all-margin-padding" style={{height: "100vh"}}>
        <Col id="left" sm={12} md={6} className ="order-sm-1 order-md-2">
        </Col>
        <Col id="right" sm={12} md={6} className ="order-sm-1 order-md-2" style={{height: "100%"}}>
        </Col>
      </Row>
      <div id="primary">
        <h1 className="sans">Coming Soon!</h1>
        <h1>Tribes of Men</h1>
        <h2 className="sans">An Aesthic Finder for men and all masculine presenting folks.</h2>
      </div>
    </Container>
  );
}
