

// @mui material components
import Card from "@mui/material/Card";
import {createTheme, ThemeProvider} from "@mui/material/styles";

import {useNavigate} from "react-router-dom";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";


// Data
import UsersData from "../../context/data/UsersTableData";
import SoftButton from "../../components/SoftButton";
import MUIDataTable from "mui-datatables";



function Tables() {
  const { columns, data } = UsersData();
  const navigate = useNavigate()

  const options = {
      selectableRows: 'none',
      caseSensitive: false,
      elevation: 2,
      expandableRowsOnClick: true,
      rowsPerPage: 100,

  }
  const muiTableTheme = createTheme(
      {
          typography: {
              fontFamily: 'Poppins',
              fontWeightBold: 'semi-bold',
          },
          palette: {
              background:{
                  paper: 'white',
                  default: "white"
              }
          },
          components: {
              MuiTableCell: {
                  styleOverrides: {
                      head: {
                          position: 'sticky',
                          padding: "3px 10px",
                          alignItems: "center",
                          justifyContent: "center"
                      },
                      body: {
                          padding: "5px 15px"
                      },
                      footer: {

                      },
                  }
              }
          }
      }
  )



  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3} position={'relative'}>
            <SoftBox
                bgColor={"white"}
                borderRadius={25}
               sx={{
                   position: "sticky",
                   top: 65,
                   zIndex: 1000
               }}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p={4}>
                <SoftTypography sx={{
                    fontFamily: 'Poppins',
                    fontWeight: "600"
                }} variant="h3" >Users Table</SoftTypography>
                <SoftButton
                    onClick={()=>navigate("/adduser")}
                    color={'success'}><SoftTypography sx={{
                    fontSize: "12px",
                    fontFamily: 'Poppins',
                    fontWeight: "bold",
                    color: "#fff",
                    fontStyle: "italic"
                }}>Add</SoftTypography></SoftButton>
            </SoftBox>

            <Card>

            <SoftBox
              sx={{
                "& .MuiTableRow-root:not(:last-child)": {
                  "& td": {
                    borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                      `${borderWidth[1]} solid ${borderColor}`,
                  },
                },
              }}
            >
                <ThemeProvider theme={muiTableTheme}>
                    <MUIDataTable
                        options={options}
                        columns={columns}
                        data={data}>
                    </MUIDataTable>
                </ThemeProvider>

            </SoftBox>
          </Card>
        </SoftBox>

      </SoftBox>
    </DashboardLayout>
  );
}

export default Tables;
