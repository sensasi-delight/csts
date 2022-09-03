import { useState } from 'react';
import { Link } from "react-router-dom";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

import Batch from "../classes/Batch";
import ProductChip from "./ProductChip";
import ProductForm from "./product/Form";


export default function BatchCard(props) {

  const batch = new Batch(props.batch);
  const upcomingProcess = batch.getUpcomingProcess()

  const [productDetail, setProductDetail] = useState({});
  const [isShowProductDetail, setIsShowProductDetail] = useState(false);

  const to = "/batch/" + batch.id + "/" + batch.date;


  return (
    <>
      <Card elevation={4}>
        {/* <CardActionArea component={Link} to={to}> */}
        <CardContent>
          <Typography variant="body2" component="p">
            Kode batch:
          </Typography>
          <Typography gutterBottom variant="h6" component="h2">
            {batch.id}
          </Typography>

          <Typography variant="body2" component="p">
            TGL. Produksi:
          </Typography>


          <Typography gutterBottom variant="h6" component="p" style={{ fontWeight: "500 !important" }}>
            {batch.date}
          </Typography>

          <Typography variant="body2" component="p">
            Status:
          </Typography>

          <Typography variant="body1" component="p" style={{ color: upcomingProcess ? '#ff9100' : '#4caf50', marginBottom: '.9em' }}>
            {upcomingProcess?.name || 'selesai: ' + batch.getFinishedAt()}
          </Typography>


          <Typography variant="body2" component="p">
            Produk:
          </Typography>

          {
            batch.processes?.length > 0 && batch.processes[12] && batch.processes[12].products?.length > 0
              ? <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {
                  batch.getProducts()?.map(product => <ProductChip
                    key={product.id}
                    product={product}
                    label={product.name + " (" + product.nPack + ")"}
                    onClick={() => {
                      setProductDetail({ ...product })
                      return setIsShowProductDetail(true)
                    }} />
                  )
                }
              </div>
              : '-'
          }
        </CardContent>

        <CardActions>
          <Button component={Link} color="primary" to={to}>
            Rincian
          </Button>
        </CardActions>


      </Card>

      <ProductForm
        isOpen={isShowProductDetail}
        isDisabled={true}
        closeForm={() => setIsShowProductDetail(false)}
        product={productDetail}
        title={'Rincian Produk: [' + productDetail.id + '] ' + productDetail.name}
      />
    </>

  );
};