import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import { useEffect } from 'react';
import { Button } from '@mui/material';
import Modal from '@mui/material/Modal';
import { Box } from '@mui/material';
import { Typography } from '@mui/material';
import { TextField } from '@mui/material';
import { Alert } from '@mui/material';
import { AlertTitle } from '@mui/material';
import qs from 'qs';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import { Autocomplete } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

const columns = [
  { id: 'merch_type_id', label: 'Type ID', minWidth: 50 },
  { id: 'merch_gen_type_id', label: 'Category ID', minWidth: 100 },
  { id: 'merch_type_name', label: 'Name', minWidth: 20 },
  { id: 'merch_gen_type_name', label: 'CategoryName', minWidth: 20 },
  { id: 'operation', label: 'Operation', minWidth: 30 }
];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const MerchandiseType = () => {

  const [addOpen, setAddOpen] = React.useState(false);
  const handleAddModal = () => {setAddOpen(!addOpen)};

  const [editOpen, setEditOpen] = React.useState(false);
  const handleEditModal = () => setEditOpen(!editOpen);

  const [successInsert, setSuccessInsert] = React.useState(false);
  const [successDelete, setSuccessDelete] = React.useState(false);
  const [successEdit, setSuccessEdit] = React.useState(false);

  const [rows, setRow] = React.useState([]);
  const [categoryRows, setCategoryRows] = React.useState([]);
  const [categorySelect, setCategorySelect] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalPage, setTotalPage] = React.useState(0);

  const [addTypeName, setAddTypeName] = React.useState("");

  const [editID, setEditID] = React.useState(0);
  const [editName, setEditName] = React.useState("");

  const [searchContent, setSearchContent] = React.useState('');
  const [searchStatus, setSearchStatus] = React.useState(false);

  useEffect(() => {
    const getStates = async () => {
      const res =
        await axios.get(`http://localhost:8082/merchandiseType/queryAllMerchandiseType`, {
          params: {
            page: page,
            rowsPerPage: rowsPerPage
          }
        });
      setRow(res.data.t);
      setTotalPage(res.data.info);
    };

    getStates()
  }, [page, rowsPerPage, successInsert, successDelete, successEdit, searchStatus])


  const handleChangePage = (event, newPage) => {
    setPage(newPage);

  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  const addNewFunction = (e) => {
    e.preventDefault();
    if (!addTypeName) {
      alert('Please add all fields!')
      return
    }
    axios.post(`http://localhost:8082/merchandiseType/addNewMerchandiseType`, qs.stringify({
        merchTypeName: addTypeName,
        merchGenTypeId: categorySelect['id']
    })).then(function (response) {
      if (response.data) {
        setSuccessInsert(true);
        setTimeout(() => { setSuccessInsert(false) }, 3000);
        setAddOpen(false);
      }
    });
    setAddTypeName('');
    setCategorySelect([]);
  }

  const deleteFunction = (Id) => {
    axios.delete(`http://localhost:8082/merchandiseType/removeMerchandiseType`, {
      params: {
        merchandiseTypeId: Id,
      }
    }).then(function (response) {
      if (response.data) {
        setSuccessDelete(true);
        setTimeout(() => { setSuccessDelete(false) }, 3000);
      }
    })
  }

  const getEditFunction = (Id) => {
    axios.get(`http://localhost:8082/merchandiseType/getMerchandiseTypeById`, {
      params: {
        merchandiseTypeId: Id,
      }
    }
    ).then(function (response) {
      setEditID(response.data.t.merch_type_id);
      setEditName(response.data.t.merch_type_name);
      setCategorySelect({'label': response.data.t.merch_gen_type_name, 'id': response.data.t.merch_gen_type_id})
    });
  }

  const editFunction = (e) => {
    e.preventDefault();
    if (!editID || !editName || !categorySelect) {
      alert('Please add all fields!')
      return
    }
    axios.post(`http://localhost:8082/merchandiseType/editMerchandiseTypeById`, qs.stringify({
        merchTypeId: editID,
        merchGenTypeId: categorySelect['id'],
        merchTypeName: editName,
    })).then(function (response) {
      if (response.data) {
        setSuccessEdit(true);
        setTimeout(() => { setSuccessEdit(false) }, 3000);
        setEditOpen(false);
      }
    });
    setEditID(0);
    setEditName('');
    setCategorySelect([]);
  }

  
  const queryAllCategories = () => {
    axios.get(`http://localhost:8082/merchandiseGenType/queryAllType`).then(
        (response) => {
          let arr = response.data.t;
          setCategoryRows(arr.map(x => {return {label:x.merchGenTypeName, id:x.merchGenTypeId}}));
        }
      )
  };

  const searchFunction = () => {
    if(searchContent === '')
    {
        setSearchStatus(!searchStatus);
    }else
    {
        axios.get(`http://localhost:8082/merchandiseType/searchMerchandiseType`, {
            params: {
                    page: page,
                    rowsPerPage: rowsPerPage,
                    'searchContent': searchContent
                }
            }).then((res) => {
                setRow(res.data.t);
                setTotalPage(res.data.info);
            });
      }
  }

  return (
    <>
      <h1>Edit Merchandise Types
        <Button variant="outlined" color="success" style={{ marginLeft: '2rem' }} onClick={() => {handleAddModal(); queryAllCategories(); setCategorySelect([])}}>
          <AddIcon />Add Merchandise Types
        </Button>
        <TextField id="outlined-basic" style={{ marginLeft: '2rem' }} label="Search" variant="outlined" value={searchContent}
                    onChange={(e) => setSearchContent(e.target.value)}/>
        <Button variant="outlined" startIcon={<SearchIcon/>} style={{ marginLeft: '2rem' }} onClick={searchFunction}>
            Search
        </Button>
      </h1>
      {successInsert ? (<Alert severity="success">
        <AlertTitle>Success</AlertTitle>
        Insert Successful — <strong>Affected Rows: 1!</strong>
      </Alert>) : ''}
      {successEdit ? (<Alert severity="success">
        <AlertTitle>Success</AlertTitle>
        Edit Successful — <strong>Affected Rows: 1!</strong>
      </Alert>) : ''}
      {successDelete ? (<Alert severity="info">Delete Successful — Affected Rows: 1!</Alert>
      ) : ''}
      <Modal
        open={addOpen}
        onClose={handleAddModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={addOpen}>
          <Box sx={style}>
            <form onSubmit={addNewFunction}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Let's Add
              </Typography>
              <Autocomplete style={{ marginTop: '1rem' }}
                value = {categorySelect}
                onChange={(event, newValue) => {setCategorySelect(newValue);}}
                disablePortal
                id="selectCountry"
                options={categoryRows}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Category" />}
              />
              <TextField fullWidth label="Merch Type Name" value={addTypeName}
                style={{ marginTop: '1rem' }} onChange={(e) => setAddTypeName(e.target.value)} />
              <Button variant="contained" color="success" style={{ marginTop: '2rem', marginLeft: '15%' }} onClick={addNewFunction}>
                Add New Merchandise Type
              </Button>
            </form>
          </Box>
        </Fade>

      </Modal>
      <Modal
        open={editOpen}
        onClose={handleEditModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={editOpen}>
          <Box sx={style}>
            <form onSubmit={editFunction}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Let's Edit
              </Typography>
              <TextField fullWidth label="Type ID" value={editID}
                style={{ marginTop: '1rem' }} onChange={(e) => setEditID(e.target.value)} />
              <Autocomplete style={{ marginTop: '1rem' }}
                value = {categorySelect}
                onChange={(event, newValue) => {setCategorySelect(newValue);}}
                disablePortal
                id="selectCountry"
                options={categoryRows}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Category" />}
              />
              <TextField fullWidth label="Type Name" value={editName}
                style={{ marginTop: '2rem' }} onChange={(e) => setEditName(e.target.value)} />
              <Button variant="contained" color="success" style={{ marginTop: '2rem', marginLeft: '15%' }} onClick={editFunction}>
                Edit Type
              </Button>
            </form>
          </Box>
        </Fade>

      </Modal>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 1000 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.merch_type_id}>
                      {columns.filter(x => x.id !== 'operation').map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                      <TableCell key='3' align={columns[3].align}>
                        <Button variant="outlined" color="error" onClick={() => { deleteFunction(row.merch_type_id) }}>
                          <DeleteIcon />Delete
                        </Button>
                        <Button variant="outlined" onClick={() => { setEditOpen(true); getEditFunction(row.merch_type_id); queryAllCategories() }}
                           color="secondary" style={{ marginLeft: '2rem' }} >
                          <ChangeCircleIcon />Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={totalPage * rowsPerPage}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}

export default MerchandiseType
