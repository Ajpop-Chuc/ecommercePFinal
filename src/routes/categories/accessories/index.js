import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  Select, 
  MenuItem, 
  FormControl,
  InputLabel,
  TextField,
  Chip,
  Box,
  Typography,
  IconButton,
  Grid,
  InputAdornment,
  Paper,
  Container,
  Card,
  CardMedia,
  CardContent,
  CircularProgress
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FilterListIcon from '@material-ui/icons/FilterList';
import ClearIcon from '@material-ui/icons/Clear';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    backgroundColor: theme.palette.grey[100],
    paddingBottom: theme.spacing(4)
  },
  pageHeader: {
    backgroundImage: 'linear-gradient(rgba(63, 81, 181, 0.85), rgba(63, 81, 181, 0.85)), url("/bg-products.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: 'white',
    padding: theme.spacing(6, 0),
    marginBottom: theme.spacing(4)
  },
  filterPaper: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
  formControl: {
    minWidth: 200,
    marginRight: theme.spacing(2)
  },
  priceField: {
    width: 120
  },
  chip: {
    margin: theme.spacing(0.5)
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginTop: theme.spacing(2)
  },
  selectedFilters: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[50],
    borderRadius: theme.shape.borderRadius
  },
  clearButton: {
    marginLeft: 'auto'
  },
  productCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[4],
      cursor: 'pointer'
    }
  },
  productMedia: {
    paddingTop: '100%', // 1:1 aspect ratio
    backgroundSize: 'cover'
  },
  productContent: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  productPrice: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    fontSize: '1.25rem',
    marginTop: 'auto'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400
  }
}));

const ProductsPage = () => {
  const classes = useStyles();
  const history = useHistory();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:4000/api/products/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar los productos');
      }

      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...products];
    
    if (selectedTags.length > 0) {
      result = result.filter(product => 
        selectedTags.every(tag => product.tags.includes(tag))
      );
    }

    if (selectedCategory) {
      result = result.filter(product => product.category === selectedCategory);
    }

    if (priceRange.min !== '') {
      result = result.filter(product => product.price >= Number(priceRange.min));
    }

    if (priceRange.max !== '') {
      result = result.filter(product => product.price <= Number(priceRange.max));
    }

    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [products, selectedTags, selectedCategory, priceRange, sortBy]);

  const handleProductClick = (productId) => {
    history.push(`/product/${productId}`);
  };

  const allTags = ['casual', 'summer', 'basic', 'winter', 'hoodie', 'premium'];
  const categories = ['Mujer', 'Hombre', 'Joggers', 'Hodies', 'Pantalones'];
  
  const hasActiveFilters = selectedCategory || selectedTags.length > 0 || priceRange.min || priceRange.max;

  const handleClearFilters = () => {
    setSelectedCategory('');
    setSelectedTags([]);
    setPriceRange({ min: '', max: '' });
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/images/placeholder.png';
    
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    if (imageUrl.startsWith('/')) {
      return `/images${imageUrl}`; // Agrega /images al inicio
    }
    
    return `/images/${imageUrl}`;
  };

  if (error) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <div className={classes.root}>
      <Container>
        {/* Filters */}
        <Paper elevation={0} className={classes.filterPaper}>
          <Box display="flex" alignItems="center" marginBottom={3}>
            <FilterListIcon color="action" />
            <Typography variant="h6" style={{ marginLeft: 8 }}>
              Filtros
            </Typography>
            {hasActiveFilters && (
              <IconButton 
                size="small" 
                className={classes.clearButton}
                onClick={handleClearFilters}
              >
                <ClearIcon /> 
                <Typography variant="body2" style={{ marginLeft: 4 }}>
                  Limpiar filtros
                </Typography>
              </IconButton>
            )}
          </Box>

          <Grid container spacing={3}>
            {/* Category */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Categoría"
                >
                  <MenuItem value="">
                    <em>Todas</em>
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category.toLowerCase()}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Price */}
            <Grid item xs={12} sm={6} md={4}>
              <Box display="flex" gap={2}>
                <TextField
                  label="Precio min"
                  variant="outlined"
                  type="number"
                  className={classes.priceField}
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoneyIcon color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Precio max"
                  variant="outlined"
                  type="number"
                  className={classes.priceField}
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoneyIcon color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Grid>

            {/* Sort */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel>Ordenar por</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Ordenar por"
                >
                  <MenuItem value="default">Destacados</MenuItem>
                  <MenuItem value="price_asc">Menor Precio</MenuItem>
                  <MenuItem value="price_desc">Mayor Precio</MenuItem>
                  <MenuItem value="name_asc">Nombre A-Z</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Tags */}
          <div className={classes.tagsContainer}>
            {allTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                color={selectedTags.includes(tag) ? "primary" : "default"}
                onClick={() => {
                  setSelectedTags(prev =>
                    prev.includes(tag)
                      ? prev.filter(t => t !== tag)
                      : [...prev, tag]
                  );
                }}
                className={classes.chip}
              />
            ))}
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <Box className={classes.selectedFilters}>
              <Typography variant="body2" color="textSecondary" style={{ marginRight: 8 }}>
                Filtros activos:
              </Typography>
              {selectedCategory && (
                <Chip
                  label={`Categoría: ${selectedCategory}`}
                  onDelete={() => setSelectedCategory('')}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              {selectedTags.map(tag => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => setSelectedTags(prev => prev.filter(t => t !== tag))}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
              {priceRange.min && (
                <Chip
                  label={`Min: $${priceRange.min}`}
                  onDelete={() => setPriceRange(prev => ({ ...prev, min: '' }))}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              {priceRange.max && (
                <Chip
                  label={`Max: $${priceRange.max}`}
                  onDelete={() => setPriceRange(prev => ({ ...prev, max: '' }))}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
          )}

          {/* Results count */}
          <Box mt={2}>
            <Typography variant="body2" color="textSecondary">
              Mostrando {filteredProducts.length} productos
            </Typography>
          </Box>
        </Paper>

        {/* Products Grid */}
        {loading ? (
          <div className={classes.loadingContainer}>
            <CircularProgress />
          </div>
        ) : (
          <Grid container spacing={3}>
            {filteredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <Card 
                  className={classes.productCard}
                  onClick={() => handleProductClick(product._id)}
                >
                  <CardMedia
                    className={classes.productMedia}
                    image={getImageUrl(product.images[0])}
                    title={product.name}
                    onError={(e) => {
                      console.log('Error loading image:', product.images[0]);
                      e.target.src = '/images/placeholder.png';
                    }}
                  />
                  <CardContent className={classes.productContent}>
                    <Typography gutterBottom variant="h6" component="h2">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      {product.description}
                    </Typography>
                    <Box mt={2} mb={1}>
                      {product.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          style={{ marginRight: 4, marginBottom: 4 }}
                        />
                      ))}
                    </Box>
                    <Typography className={classes.productPrice}>
                      ${product.price.toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </div>
  );
};

export default ProductsPage;