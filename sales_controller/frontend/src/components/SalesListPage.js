import {
  Container,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  TablePagination,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Swal from 'sweetalert2';
import { format } from 'date-fns';

function SalesList() {
  const [vendas, setVendas] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [visibleDetails, setVisibleDetails] = useState(null);
  const [visibleSaleId, setVisibleSaleId] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/api/sale/')
      .then((response) => {
        setVendas(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleNovaVenda = () => {
    navigate('/new-sale');
  };

  const handleTrocarPagina = (event, newPage) => {
    setPage(newPage);
  };

  const handleTrocarLinhasPorPagina = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMostrarDetalhes = (vendaId) => {
    axios.get(`http://localhost:8080/api/sale/${vendaId}/get_sale_detailed/`)
      .then((response) => {
        const details = response.data;
        setVisibleDetails(Array.isArray(details) ? details : [details]);
        setVisibleSaleId(vendaId);
      })
      .catch((error) => {
        console.error('Erro ao obter detalhes da venda', error);
      });
  };

  const handleExcluirVenda = (vendaId) => {
    axios
      .delete(`http://localhost:8080/api/sale/${vendaId}/`)
      .then((response) => {
        Swal.fire({
          icon: 'success',
          title: 'Venda excluída com sucesso!',
          showConfirmButton: true,
        });

        const updatedVendas = vendas.filter((venda) => venda.id !== vendaId);
        setVendas(updatedVendas);
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao excluir a venda',
          text: 'Ocorreu um erro ao tentar excluir a venda. Por favor, tente novamente.',
        });
      });
  };
  
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, vendas.length - page * rowsPerPage);

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2} alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h4">Vendas Realizadas</Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleNovaVenda}>
            Inserir Nova Venda
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Cliente</TableCell>
              <TableCell align="center">Vendedor</TableCell>
              <TableCell align="center">Data da Venda</TableCell>
              <TableCell align="center">Valor Total</TableCell>
              <TableCell align="center">Opções</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vendas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Não há resultados para mostrar.
                </TableCell>
              </TableRow>
            ) : (
              (rowsPerPage > 0 ? vendas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : vendas
              ).map((venda) => (
                <React.Fragment key={venda.id}>
                  <TableRow>
                    <TableCell align="center">{venda.customer}</TableCell>
                    <TableCell align="center">{venda.seller}</TableCell>
                    <TableCell align="center">
                      {format(new Date(venda.sale_date), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell  align="center">
                      {`R$ ${parseFloat(venda.sale_amount).toFixed(2)}`}
                    </TableCell>
                    <TableCell align="center">
                      <Link to={`/edit-sale/${venda.id}`}>
                        <IconButton color="primary">
                          <EditIcon />
                        </IconButton>
                      </Link>
                      <IconButton 
                        color="secondary" 
                        onClick={() => handleExcluirVenda(venda.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton onClick={() => handleMostrarDetalhes(venda.id)}>
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  {visibleSaleId === venda.id && visibleDetails && (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Produto/Serviço</TableCell>
                              <TableCell>Quantidade</TableCell>
                              <TableCell>Preço unitário</TableCell>
                              <TableCell>Total produto</TableCell>
                              <TableCell>% de Comissão</TableCell>
                              <TableCell>Comissão</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {visibleSaleId === venda.id && visibleDetails &&(
                              <TableRow>
                                <TableCell>{visibleDetails[0].product_id} - {visibleDetails[0].product_name}</TableCell>
                                <TableCell>{visibleDetails[0].quantity}</TableCell>
                                <TableCell>{`R$ ${visibleDetails[0].unit_price.toFixed(2)}`}</TableCell>
                                <TableCell>{`R$ ${visibleDetails[0].total_price.toFixed(2)}`}</TableCell>
                                <TableCell>{visibleDetails[0].commission_rate}%</TableCell>
                                <TableCell>{`R$ ${visibleDetails[0].commission.toFixed(2)}`}</TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )}

            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={5} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={vendas.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleTrocarPagina}
        onRowsPerPageChange={handleTrocarLinhasPorPagina}
      />
    </Container>
  );
}

export default SalesList;