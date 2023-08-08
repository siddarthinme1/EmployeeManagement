import React, { useState } from "react";
import {
  Paper,
  TableBody,
  TableCell,
  TableRow,
  Toolbar,
  InputAdornment,
  Switch,
  FormControlLabel,
  Alert,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import EmployeeForm from "./EmployeeForm";
import PageHeader from "../../Components/PageHeader";
import PeopleIcon from "@mui/icons-material/People";
import Control from "../../Controls/Control";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import useTable from "../../Components/useTable";
import Popup from "../../Components/Popup";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RestoreIcon from "@mui/icons-material/Restore";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import useEmployeeServices from "../../Services/EmployeeService";
import CustomAlert from "../../Components/CustomAlert";
import Snackbar from "@mui/material/Snackbar";
import { Box } from "@material-ui/core";
import Header from "../../Components/Header";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(3),
    padding: theme.spacing(3),
  },
  searchInput: {
    width: "50%",
    "&:hover": {
      backgroundColor: "#F2F2F2",
    },
  },
  addButton: {
    marginLeft: "250px",
  },
  binSwitch: {
    marginLeft: "20px",
  },
}));

const headCells = [
  { id: "id", label: "ID" },
  { id: "gender", label: "Gender" },
  { id: "fullName", label: "Full Name" },
  { id: "phone", label: "Phone" },
  { id: "mail", label: "Email" },
  { id: "birthday", label: "Birthday" },
  { id: "blood", label: "Blood" },
  { id: "address", label: "Address" },
  { id: "emergency", label: "Emergency Contact Details" },
  { id: "", label: "" },
];

function Employees() {
  const classes = useStyles();

  const {
    addEmployee,
    useAllEmployees,
    deleteEmployee,
    updateEmployee,
    useBinEmployees,
    emptyRecycleBin,
    restoreEmployee,
  } = useEmployeeServices();

  const [openPopup, setOpenPopup] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [bin, setBin] = useState(false);
  const [itemIdToDelete, setItemIdToDelete] = useState(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showRestoreAlert, setShowRestoreAlert] = useState(false);
  const [showEmptyBinAlert, setShowEmptyBinAlert] = useState(false);
  const [itemIdToRestore, setItemIdToRestore] = useState(null);
  const [open, setOpen] = React.useState(false);

  const employees = useAllEmployees();
  const deletedEmployees = useBinEmployees();

  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });

  const { TblContainer, TblHead, TblPagination, recordsAfterPaging } = useTable(
    bin === false ? employees : deletedEmployees,
    headCells,
    filterFn
  );

  const addOrEdit = (employee, resetForm) => {
    if (employee.id === 0) {
      addEmployee(employee);
    } else {
      updateEmployee(employee);
    }
    setRecordForEdit(null);
    resetForm();
    setOpenPopup(false);
    setOpen(true);
  };

  const handleDelete = (id) => {
    setShowDeleteAlert(true);
    setItemIdToDelete(id);
  };

  const handleConfirmDelete = () => {
    deleteEmployee(itemIdToDelete);
    setShowDeleteAlert(false);
  };

  const handleRestore = (id) => {
    setShowRestoreAlert(true);
    setItemIdToRestore(id);
  };

  const handleConfirmRestore = () => {
    restoreEmployee(itemIdToRestore);
    setShowRestoreAlert(false);
  };

  const handleEmptyRecycleBin = () => {
    setShowEmptyBinAlert(true);
  };

  const handleConfirmEmptyBin = () => {
    emptyRecycleBin();
    setShowEmptyBinAlert(false);
  };

  const openInPopup = (employee) => {
    if (bin === false) {
      setRecordForEdit(employee);
      setOpenPopup(true);
    }
  };

  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (items) => {
        if (target.value === "") {
          return items;
        } else {
          const searchValue = target.value.toLowerCase();
          return items.filter((item) =>
            Object.values(item).some(
              (value) =>
                typeof value === "string" &&
                value.toLowerCase().includes(searchValue)
            )
          );
        }
      },
    });
  };

  return (
    <>
      <div
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        
        <PageHeader
          title="Employee"
          subTitle="Form Design With Validation"
          icon={<PeopleIcon fontSize="large" />}
        />
        <Paper elevation={0} className={classes.pageContent}>
          <Toolbar>
            <Control.Input
              className={classes.searchInput}
              label="Search Employee"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              onChange={handleSearch}
            />

            <Control.Button
              fullwidth
              className={classes.addButton}
              text="Add new"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => {
                setOpenPopup(true);
                setRecordForEdit(null);
              }}
            />

            <FormControlLabel
              control={
                <Switch
                  className={classes.binSwitch}
                  onChange={() => setBin(bin === true ? false : true)}
                />
              }
              labelPlacement="end"
              label="Bin"
            />
            {bin === true ? (
              <Control.ActionButton>
                <ClearAllIcon onClick={() => handleEmptyRecycleBin()} />
              </Control.ActionButton>
            ) : null}
          </Toolbar>

          <TblContainer>
            <TblHead></TblHead>
            <TableBody>
              {employees.length > 0 ? (
                recordsAfterPaging().map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.id}</TableCell>
                    <TableCell>{employee.gender}</TableCell>
                    <TableCell
                      onClick={() => {
                        openInPopup(employee);
                      }}
                    >
                      {employee.firstName} {employee.lastName}
                    </TableCell>
                    <TableCell>{employee.phone}</TableCell>
                    <TableCell>{employee.mail}</TableCell>
                    <TableCell>{employee.birthday.slice(0, 10)}</TableCell>
                    <TableCell>{employee.blood}</TableCell>
                    <TableCell>
                      {employee.streetAddress} {employee.streetAddress2}
                      <br />
                      {employee.city} {employee.state}
                      <br />
                      {employee.country} {employee.zipcode}
                    </TableCell>

                    <TableCell>
                      {employee.firstNamex} {employee.lastNamex}
                      <br />
                      {employee.relation}
                      <br />
                      {employee.phonex}
                      <br />
                      {employee.streetAddressx} {employee.streetAddress2x}{" "}
                      <br />
                      {employee.cityx} {employee.statex}
                      <br />
                      {employee.countryx} {employee.zipcodex}
                    </TableCell>
                    {bin === false ? (
                      <TableCell>
                        <Control.ActionButton>
                          <DeleteForeverIcon
                            onClick={() => handleDelete(employee.id)}
                          />
                        </Control.ActionButton>
                      </TableCell>
                    ) : (
                      <TableCell>
                        <Control.ActionButton>
                          <RestoreIcon
                            onClick={() => handleRestore(employee.id)}
                          />
                        </Control.ActionButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="text-center">
                    No Employees
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </TblContainer>
          <TblPagination />
        </Paper>
        <Popup
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
          title={recordForEdit ? "Edit Employee" : "Add Employee"}
        >
          {" "}
          <EmployeeForm recordForEdit={recordForEdit} addOrEdit={addOrEdit} />
        </Popup>

        <CustomAlert
          open={showDeleteAlert}
          title="Confirm Delete"
          message="Are you sure to delete this record?"
          onClose={() => setShowDeleteAlert(false)}
          onConfirm={handleConfirmDelete}
        />

        <CustomAlert
          open={showRestoreAlert}
          title="Confirm Restore"
          message="Are you sure to restore the details?"
          onClose={() => setShowRestoreAlert(false)}
          onConfirm={handleConfirmRestore}
        />

        <CustomAlert
          open={showEmptyBinAlert}
          title="Confirm Empty Recycle Bin"
          message="Are you sure to empty the recycle bin?"
          onClose={() => setShowEmptyBinAlert(false)}
          onConfirm={handleConfirmEmptyBin}
        />
        <Snackbar
          open={open}
          autoHideDuration={2000}
          onClose={() => setOpen(false)}
        >
          <Alert
            onClose={() => setOpen(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            Employee Added Successfully
          </Alert>
        </Snackbar>
      </div>
    </>
  );
}

export default Employees;
