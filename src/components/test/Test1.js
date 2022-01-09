import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Stack from '@mui/material/Stack';
import axios from 'axios';

const Input = styled('input')({
    display: 'none',
  });
const Test1 = () => {

    const updateImg = () => {
        var formData = new FormData();
        var inp = document.getElementById("icon-button-file").files[0];
        formData.append('img', inp);
        formData.append('merchId', 1);
        axios({
            url:'http://localhost:8082/merchandise/updateMerchandiseImg',
            method: 'post',
            headers:{'Content-Type':'multipart/form-data'},
            data:formData
        }).then(
            request =>{
                console.log(request.data)
            },
            error =>{
                console.log(error.data)
            }
        )
    }

    return (
        <Stack direction="row" alignItems="center" spacing={2}>
            <label htmlFor="icon-button-file">
                <Input accept="image/*" id="icon-button-file" type="file" />
                <IconButton color="primary" aria-label="upload picture" component="span">
                <PhotoCamera />
                </IconButton>
                <Button onClick={updateImg}>Upload</Button>
      </label>
    </Stack>
    )
}

export default Test1
