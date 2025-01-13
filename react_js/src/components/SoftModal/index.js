
import {DialogContent, DialogTitle, DialogActions, Modal} from "@mui/material";
import SoftBox from "../SoftBox";
import SoftTypography from "../SoftTypography";
import Divider from "@mui/material/Divider";
import SoftButton from "../SoftButton";


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


const SoftModal = (props) => {
  const {open, setOpen, message, handleDelete} = props


    return(
        <Modal
            open={open}
            onClose={()=>setOpen('false')}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <SoftBox sx={style}>
                <DialogTitle>
                <SoftTypography id="modal-modal-title" variant="h4" component="h2">
                    Confirmation
                </SoftTypography>
                </DialogTitle>
                <Divider/>
                <DialogContent>
                <SoftTypography id="modal-modal-description" sx={{ mt: 2 }}>
                    Are you sure you want to remove this {message}?
                </SoftTypography>
                </DialogContent>
                <DialogActions>
                    <SoftButton variant="solid" size={'small'} color={"neutral"} onClick={() => setOpen(false)}>
                        Discard
                    </SoftButton>
                    <SoftButton variant="plain" size={'small'} color={"error"} onClick={() =>{
                        handleDelete()
                        setOpen(false)}}>
                        Proceed
                    </SoftButton>
                </DialogActions>
            </SoftBox>
        </Modal>
    )
}

export default SoftModal
