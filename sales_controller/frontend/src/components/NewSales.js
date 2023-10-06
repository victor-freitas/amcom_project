import {
  Container,
  Grid,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Swal from 'sweetalert2';
import React, { useEffect, useState } from 'react';
import axios from 'axios';


function NewSale() {
  const [cliente, setCliente] = useState('');
  const [vendedor, setVendedor] = useState('');
  const [comissao, setComissao] = useState('');
  const [dataVenda, setDataVenda] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [quantidade, setQuantidade] = useState(1);
  const [selectedProduto, setSelectedProduto] = useState('');
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [comissoes, setComissoes] = useState([]);
  const navigate = useNavigate();
  const { saleId } = useParams();
  const isEditing = !!saleId;
  
  useEffect(() => {
    if (isEditing) {
      axios
        .get(`http://localhost:8080/api/sale/${saleId}/`)
        .then((response) => {
          const venda = response.data;
          console.log(venda);
          setCliente(venda.customer);
          setVendedor(venda.seller);
          setComissao(venda.commission_settings);
          setDataVenda(venda.sale_date);
        })
        .catch((error) => {
          console.error(error);
        });
    }
    axios
      .get('http://localhost:8080/api/customers/')
      .then((response) => {
        setClientes(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get('http://localhost:8080/api/sellers/')
      .then((response) => {
        setVendedores(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get('http://localhost:8080/api/products/')
      .then((response) => {
        setProdutos(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    axios
      .get('http://localhost:8080/api/comission-settings/')
      .then((response) => {
        setComissoes(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [isEditing, saleId]);


  const handleProdutoChange = (event) => {
    setSelectedProduto(event.target.value);
  };

  const handleInserirEditarVenda = () => {
    if (saleId) {
      const vendaEditada = {
        sale_date: dataVenda,
        sale_amount: parseFloat(produtosSelecionados[0].total),
        product: produtosSelecionados[0].id,
        customer: cliente,
        seller: vendedor,
        commission_settings: comissao,
      };
  
      axios
        .put(`http://localhost:8080/api/sale/${saleId}/`, vendaEditada)
        .then((response) => {
          Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'A venda foi editada com sucesso!',
            confirmButtonText: 'Ok!',
          }).then((result) => {
            if (result.isConfirmed) {
              navigate('/list-sales');
            }
          });
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Ocorreu um erro ao editar a venda.',
          });
          window.location.reload();
        });
    } else {
      if (cliente && vendedor && comissao && dataVenda && produtosSelecionados.length > 0) {
        const novaVenda = {
          sale_date: dataVenda,
          sale_amount: parseFloat(produtosSelecionados[0].total),
          product: produtosSelecionados[0].id,
          customer: cliente,
          seller: vendedor,
          commission_settings: comissao,
          sale_quantity: produtosSelecionados[0].quantidade
        };
        axios
          .post('http://localhost:8080/api/sale/', novaVenda)
          .then((response) => {
            setCliente('');
            setVendedor('');
            setComissao('');
            setProdutosSelecionados([]);
            Swal.fire({
              icon: 'success',
              title: 'Sucesso!',
              text: 'A venda foi cadastrada com sucesso!',
              confirmButtonText: 'Ok!',
            }).then((result) => {
              if (result.isConfirmed) {
                navigate('/list-sales');
              }
            });
          })
          .catch((error) => {
            console.log(error)
            Swal.fire({
              icon: 'error',
              title: 'Erro',
              text: 'Ocorreu um erro ao inserir a venda.',
            });
            window.location.reload();
          });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Certifique-se de preencher todos os campos corretamente.',
        });
      }
    }
  };

  const handleAdicionarProduto = () => {
    if (selectedProduto !== '' && quantidade > 0) {
      const produtoSelecionado = produtos.find(
        (produto) => produto.id === selectedProduto
      );
      if (produtoSelecionado) {
        const novoProduto = {
          id: produtoSelecionado.id,
          nome: produtoSelecionado.name,
          quantidade: quantidade,
          precoUnitario: produtoSelecionado.price,
          total: quantidade * produtoSelecionado.price,
        };
        setProdutosSelecionados([...produtosSelecionados, novoProduto]);
        setSelectedProduto('');
        setQuantidade(quantidade);
      }
    }
  };

  const handleExcluirProduto = (produtoId) => {
    const novosProdutosSelecionados = produtosSelecionados.filter(
      (produto) => produto.id !== produtoId
    );
    setProdutosSelecionados(novosProdutosSelecionados);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2} alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h4">Inserir Nova Venda</Typography>
        </Grid>
      </Grid>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Cliente</InputLabel>
              <Select
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
              >
                {clientes.map((cliente) => (
                  <MenuItem key={cliente.id} value={cliente.id}>
                  {cliente.id} - {cliente.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Vendedor</InputLabel>
              <Select
                value={vendedor}
                onChange={(e) => setVendedor(e.target.value)}
              >
                {vendedores.map((vendedor) => (
                  <MenuItem key={vendedor.id} value={vendedor.id}>
                  {vendedor.id} - {vendedor.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Tipo Comissão</InputLabel>
              <Select
                value={comissao}
                onChange={(e) => setComissao(e.target.value)}
              >
                {comissoes.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.day_of_week}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              variant="outlined"
              type="date"
              fullWidth
              value={dataVenda}
              onChange={(e) => setDataVenda(e.target.value)}
            />
          </Grid>
        </Grid>
        <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
          Produtos/Serviços
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Selecionar Produto</InputLabel>
              <Select
                value={selectedProduto}
                onChange={handleProdutoChange}
              >
                {produtos.map((produto) => (
                  <MenuItem key={produto.id} value={produto.id}>
                    {produto.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              label="Quantidade"
              variant="outlined"
              fullWidth
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleAdicionarProduto}
            >
              Adicionar
            </Button>
          </Grid>
        </Grid>
        {produtosSelecionados.length > 0 && (
          <TableContainer component={Paper} style={{ marginTop: '20px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Produto/Serviço</TableCell>
                  <TableCell>Quantidade</TableCell>
                  <TableCell>Preço Unitário</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {produtosSelecionados.map((produto) => (
                  <TableRow key={produto.id}>
                    <TableCell>{produto.nome}</TableCell>
                    <TableCell>{produto.quantidade}</TableCell>
                    <TableCell>
                      {`R$ ${parseFloat(produto.precoUnitario).toFixed(2)}`}
                    </TableCell>
                    <TableCell>
                    {`R$ ${parseFloat(produto.total).toFixed(2)}`}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleExcluirProduto(produto.id)}
                        startIcon={<DeleteOutlineIcon />}
                      >
                        Excluir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginTop: '20px' }}
          onClick={handleInserirEditarVenda}
        >
          {saleId ? 'Editar Venda' : 'Inserir Venda'}
        </Button>
      </form>
    </Container>
  );
}

export default NewSale;
