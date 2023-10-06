import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Card,
  CardContent,
  Box,
} from '@mui/material';

function Comission() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const handleFilterClick = () => {
    const apiUrl = `http://localhost:8080/api/seller-commissions/?start_date=${startDate}&end_date=${endDate}`;

    axios
      .get(apiUrl)
      .then((response) => {
        setReportData(response.data);
        setShowTable(true);
      })
      .catch((error) => {
        console.error('Erro ao buscar dados do relatório:', error);
      });
  };

  const totalCommissions = reportData.reduce(
    (total, item) => total + (item.total_commission || 0),
    0
  );

  return (
    <Container maxWidth="lg">
      <Card style={{ marginBottom: '20px' }}>
        <CardContent>
          <Grid container alignItems="center">
            <Grid item xs={8}>
              <Typography variant="h4" gutterBottom>
                Relatório de Comissões
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="Data de Início"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="Data de Fim"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} style={{ marginTop: '10px', textAlign: 'right' }}>
              <Button variant="contained" color="primary" onClick={handleFilterClick}>
                Filtrar
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {showTable && (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Cód. Vendedor</TableCell>
                  <TableCell>Vendedor</TableCell>
                  <TableCell>Total Vendas</TableCell>
                  <TableCell>Total de Comissões</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.total_sales}</TableCell>
                    <TableCell>
                      R$ {item.total_commission ? item.total_commission.toFixed(2) : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box style={{ marginTop: '20px', textAlign: 'right' }}>
            <Typography variant="h6">Total de Comissões do Período: R$ {totalCommissions.toFixed(2)}</Typography>
          </Box>
        </>
      )}
    </Container>
  );
}

export default Comission;
