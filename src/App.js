import React, { Component } from 'react';
import chalk from 'chalk';
import { createClient } from 'contentful';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import logo from './logo.svg';
import './App.css';
import { contentFulCredentials } from './config/constants';

class App extends Component {
  constructor(props) {
    super(props);
   
    this.contentTypeId = 'product';
    this.client = createClient(contentFulCredentials);

    this.state = {
      loading: true,
      products: []
    }
  }

  resolveProductImages(entry) {
    const covers = entry.fields.covers.map((cover) => ({
      fileName: cover.fields.file.fileName,
      url: `http://${cover.fields.file.url.slice(2)}`
    }))
    return covers;
  }

  // {
  //   id:
  //   title:
  //   covers: [
  //     {
  //       fileName: 
  //       url: 
  //     }
  //   ]
  // }

  componentWillMount() {
    this.setState({loading: true})
    this.client.getEntries()
      .then((response) => {
        const products = response.items.map((product) => ({
          id: product.sys.id,
          title: product.fields.title,
          covers: this.resolveProductImages(product)
        }))
        this.setState({loading: false, products})
      })
      .catch((error) => {
        console.log(chalk.red('\nError occurred while fetching Content Types:'))
        console.error(error)
      })
  }

  renderProducts() {
    return this.state.products.map((product) => (
      <div className="App-product" key={product.id}>
        <Card className="App-product-card">
          <CardMedia className="App-product-image"
            image={product.covers[0].url}
            title={product.covers[0].fileName}
          />
          <CardContent>
            <Typography gutterBottom variant="headline" component="h2">
              {product.title}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" color="primary">
              Share
            </Button>
            <Button size="small" color="primary">
              Learn More
            </Button>
          </CardActions>
        </Card>
      </div>
    ));
  }

  render() {
    let render;
    if (this.state.loading) {
      render = (
        <div className="App">
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Lego Mini Figures</h1>
          </header>
          <div className="App-loader">
            <CircularProgress size={50} />
          </div>
        </div>
      );
    } else {
      render = (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Lego Mini Figures</h1>
          </header>
          <div>
            {this.renderProducts()}
          </div>
        </div>
      );
    }
    return render;
  }
}

export default App;
