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
import { ImageList, ImageListItem } from '@mui/material';
import { styled } from '@mui/material/styles';

import DeleteIcon from '@mui/icons-material/Delete';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ImageIcon from '@mui/icons-material/Image';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Stack from '@mui/material/Stack';

const columns = [
  { id: 'merch_id', label: 'Merch ID', minWidth: 20 },
  { id: 'merch_type_id', label: 'Type ID', minWidth: 20 },
  { id: 'merch_name', label: 'Merch Name', minWidth: 50 },
  { id: 'merch_type_name', label: 'CategoryName', minWidth: 50 },
  { id: 'operation', label: 'Operation', minWidth: 30 }
];

const Input = styled('input')({
  display: 'none',
});

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
const style2 = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1200,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

const Merchandise = () => {

  const [addOpen, setAddOpen] = React.useState(false);
  const handleAddModal = () => {setAddOpen(!addOpen)};

  const [editOpen, setEditOpen] = React.useState(false);
  const handleEditModal = () => setEditOpen(!editOpen);

  const [imageOpen, setImageOpen] = React.useState(false);
  const handleImageModal = () => setImageOpen(!imageOpen);

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
  const [editPhotoFolder, setEditPhotoFolder] = React.useState("");
  const [editName, setEditName] = React.useState("");
  const [editCreateDate, setEditCreateDate] = React.useState("");
  const [editStatus, setEditStatus] = React.useState(0);
  const [editMerchYearSaleStat, setEditMerchYearSaleStat] = React.useState(0);
  const [editMerchSpecial, setEditMerchSpecial] = React.useState(0);

  const [searchContent, setSearchContent] = React.useState('');
  const [searchStatus, setSearchStatus] = React.useState(false);

  const [uploadFolder, setUploadFolder] = React.useState('');
  const [ImageFolder, setImageFolder] = React.useState('');
  const [imageSet, setImageSet] = React.useState([]);
  const [uploadImageMerchId, setUploadImageMerchId] = React.useState(0);
  const [uploadInfo, setUploadInfo] = React.useState('')

  useEffect(() => {
    const setInfo = async () => {
      setTimeout(() => {
        setUploadInfo('')
      }, 3000)
    };

    setInfo()
  }, [uploadInfo])

  useEffect(() => {
    const getProperty = async () => {
      const res =
        await axios.get(`http://localhost:8082/merchandise/queryAllMerchandise`, {
          params: {
            page: page,
            rowsPerPage: rowsPerPage
          }
        });
      setRow(res.data.t);
      setTotalPage(res.data.info);
    };

    getProperty()
  }, [page, rowsPerPage, successInsert, successDelete, successEdit, searchStatus])

  useEffect(() => {
    const getFolder = () => {
        axios.get(`http://localhost:8082/util/uploadFolder`).then((res) => {
            setUploadFolder(res.data);
        })
    };
    getFolder()
  }, [])

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
    axios.post(`http://localhost:8082/merchandise/addNewMerchandise`, qs.stringify({
        merchName: addTypeName,
        merchTypeId: categorySelect['id']
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
    axios.delete(`http://localhost:8082/merchandise/removeMerchandise`, {
      params: {
        merchandiseId: Id,
      }
    }).then(function (response) {
      if (response.data) {
        setSuccessDelete(true);
        setTimeout(() => { setSuccessDelete(false) }, 3000);
      }
    })
  }

  const inactivateFunction = (Id) => {
    axios.delete(`http://localhost:8082/merchandise/inactivateMerchandise`, {
      params: {
        merchandiseId: Id,
      }
    }).then(function (response) {
      if (response.data) {
        setSuccessEdit(true);
        setTimeout(() => { setSuccessEdit(false) }, 3000);
      }
    })
  }

  const getEditFunction = (Id) => {
    setEditID(0);
    setEditName('');
    setEditPhotoFolder('');
    setEditCreateDate('');
    setEditStatus(0);
    setEditMerchYearSaleStat(0);
    setEditMerchSpecial(0);
    setCategorySelect([]);
    axios.get(`http://localhost:8082/merchandise/getMerchandiseById`, {
      params: {
        merchandiseId: Id,
      }
    }
    ).then(function (response) {
      setEditID(response.data.t.merch_id);
      setEditName(response.data.t.merch_name);
      setCategorySelect({'label': response.data.t.merch_type_name, 'id': response.data.t.merch_type_id})
      setEditPhotoFolder(response.data.t.merch_photo_folder);
      setEditCreateDate(response.data.t.merch_create_date);
      setEditStatus(response.data.t.merch_status);
      setEditMerchYearSaleStat(response.data.t.merch_year_sale_stat);
      setEditMerchSpecial(response.data.t.merch_special);
    });
  }

  const editFunction = (e) => {
    e.preventDefault();
    if (!editID || !editName || !categorySelect || !editPhotoFolder || !editCreateDate || !editStatus) {
      alert('Please add all fields!')
      return
    }
    axios.post(`http://localhost:8082/merchandise/editMerchandiseById`, qs.stringify({
        merchId: editID,
        merchTypeId: categorySelect['id'],
        merchName: editName,
        merchPhotoFolder: editPhotoFolder,
        merchCreateDate: editCreateDate.replace("T", " "),
        merchStatus: editStatus,
        merchYearSaleStat: editMerchYearSaleStat,
        merchSpecial: editMerchSpecial,
    })).then(function (response) {
      if (response.data) {
        setSuccessEdit(true);
        setTimeout(() => { setSuccessEdit(false) }, 3000);
        setEditOpen(false);
      }
    });
    setEditID(0);
    setEditName('');
    setEditPhotoFolder('');
    setEditCreateDate('');
    setEditStatus(0);
    setEditMerchYearSaleStat(0);
    setEditMerchSpecial(0);
    setCategorySelect([]);
  }

  
  const queryAllCategories = () => {
    axios.get(`http://localhost:8082/merchandiseType/queryAllMerchandiseTypeAll`).then(
        (response) => {
          let arr = response.data.t;
          setCategoryRows(arr.map(x => {return {label:x.merchTypeName, id:x.merchTypeId}}));
        }
      )
  };

  const searchFunction = () => {
    if(searchContent === '')
    {
        setSearchStatus(!searchStatus);
    }else
    {
        axios.get(`http://localhost:8082/merchandise/searchMerchandise`, {
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

  const getImageFunction = (Id) => {
    axios.get(`http://localhost:8082/merchandise/getImageFolder`, {
            params: {
                merchId:Id
                }
            }).then((res) => {
                setImageFolder(uploadFolder + "merchandise/" + res.data );
        });
    axios.get(`http://localhost:8082/merchandise/getImageSet`, {
            params: {
                merchId:Id
                }
            }).then((res) => {
                setImageSet(res.data);
                setUploadImageMerchId(Id);
        });
  }

  const updateImg = () => {
    var formData = new FormData();
    var inp = document.getElementById("icon-button-file").files[0];
    if(imageSet.length >= 6)
    {
      setUploadInfo("Max Number of Image is reached !");
      return
    }
    if(!inp)
    {
      return
    }
    formData.append('img', inp);
    formData.append('merchId', uploadImageMerchId);
    axios({
        url:'http://localhost:8082/merchandise/updateMerchandiseImg',
        method: 'post',
        headers:{'Content-Type':'multipart/form-data'},
        data:formData
    }).then((res) => {
        setUploadInfo(res.data.info);
        getImageFunction(uploadImageMerchId)
      }
    )
}

const deleteImage = (Id) => {
  axios.delete(`http://localhost:8082/merchandise/removeImage`, {
    params: {
      merchId: uploadImageMerchId,
      imageId: Id
    }
  }).then(function (response) {
    if (response.data === 1) {
      setUploadInfo('Successful!');
      getImageFunction(uploadImageMerchId);
    }else{
      setUploadInfo('Fail!');
    }
  })
}

  return (
    <>
      <h1>Edit Merchandise
        <Button variant="outlined" color="success" style={{ marginLeft: '2rem' }} onClick={() => {handleAddModal(); queryAllCategories(); setCategorySelect([])}}>
          <AddIcon />Add Merchandise
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
              <TextField required fullWidth label="Merchandise Name" value={addTypeName}
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
              <TextField required fullWidth label="Type ID" value={editID}
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
              <TextField required fullWidth label="Merchandise Name" value={editName}
                style={{ marginTop: '2rem' }} onChange={(e) => setEditName(e.target.value)} />

                <TextField required fullWidth label="Create Date" value={editCreateDate}
                style={{ marginTop: '2rem' }} onChange={(e) => setEditCreateDate(e.target.value)} />

                <Typography variant="body2" style={{ marginTop: '2rem' }}>
                (1 for on sale, -1 for inactive, 0 for off sale, 2 for promotion)
                </Typography>
                <TextField required fullWidth label="Status " value={editStatus} style={{ marginTop: '1rem' }}
                 onChange={(e) => setEditStatus(e.target.value)} />
                <TextField required fullWidth label="Yearly Sold Number" value={editMerchYearSaleStat}
                style={{ marginTop: '2rem' }} onChange={(e) => setEditMerchYearSaleStat(e.target.value)} />
                <TextField required fullWidth label="Special Status (0 for normal)" value={editMerchSpecial}
                style={{ marginTop: '2rem' }} onChange={(e) => setEditMerchSpecial(e.target.value)} />
                <TextField required fullWidth label="Photo Folder String" value={editPhotoFolder}
                style={{ marginTop: '2rem' }} onChange={(e) => setEditPhotoFolder(e.target.value)} />
              <Button variant="contained" color="success" style={{ marginTop: '2rem', marginLeft: '15%' }} onClick={editFunction}>
                Edit Type
              </Button>
            </form>
          </Box>
        </Fade>
      </Modal>
      <Modal
        open={imageOpen}
        onClose={handleImageModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={imageOpen}>
          <Box sx={style2}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Merchandise Images
              </Typography>
              <Alert variant="outlined" severity="info" >
                  Info: {uploadInfo}
              </Alert>
              <Input accept="image/*" id="icon-button-file" type="file" />
              <Stack direction="row" alignItems="center" spacing={2}>
                  <label htmlFor="icon-button-file">
                      <Input accept="image/*" id="icon-button-file" type="file" />
                      <IconButton color="primary" aria-label="upload picture" component="span">
                      <PhotoCamera />
                      </IconButton>
                      <Button onClick={updateImg}>Upload</Button>
                  </label>
              </Stack>
              <ImageList
                    sx={{ width: 1100, height: 800 }}
                    cols={2} rowHeight={500}
                >
                    {
                    imageSet.map((x) =>{
                      var temp = Math.random();
                        return(
                            <ImageListItem key={x}>
                                <img
                                src={`${ImageFolder+"/"+x+'.jpg?temp='+temp+'&'}?w=164&h=164&fit=crop&auto=format`}
                                srcSet={`${ImageFolder+"/"+x+'.jpg?temp='+temp+'&'}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                loading="lazy"
                                style={{margin:'2rem', }}
                                alt=''
                            />
                            <Button variant="outlined" startIcon={<DeleteIcon />} onClick={() => {deleteImage(x)}}>
                                Delete
                            </Button>
                            </ImageListItem>
                            
                        );
                        
                    })
                }
                </ImageList>
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
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.merch_id}>
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
                        <Button variant="outlined" color="error" onClick={() => { deleteFunction(row.merch_id) }}>
                          <DeleteIcon />
                        </Button>
                        <Button variant="outlined" color="error" onClick={() => { inactivateFunction(row.merch_id) }} style={{ marginLeft: '1rem' }} >
                          Inactivate
                        </Button>
                        <Button variant="outlined" onClick={() => { setEditOpen(true); getEditFunction(row.merch_id); queryAllCategories() }}
                           color="secondary" style={{ marginLeft: '1rem' }} >
                          <ChangeCircleIcon />Edit
                        </Button>
                        <Button variant="outlined" onClick={() => {getImageFunction(row.merch_id); setImageOpen(true); }}
                           style={{ marginLeft: '1rem' }} >
                          <ImageIcon />IMG
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

export default Merchandise
