import { useMemo, useState } from 'react';
import '../style.css';

const products = [
  { id: 1, name: 'Soft Focus', notes: 'Iris, skin musk, cedar', price: 86, category: 'woody' },
  { id: 2, name: 'Sunday', notes: 'Bergamot, neroli, linen', price: 78, category: 'fresh' },
  { id: 3, name: 'After Rain', notes: 'Fig leaf, moss, vetiver', price: 92, category: 'fresh' },
  { id: 4, name: 'Daydream', notes: 'Rose, saffron, amber', price: 86, category: 'floral' },
];

function ProductCard({ product, onAdd }) {
  return (
    <article className="product-card">
      <div className="product-visual"><div className="product-bottle" data-name={product.name.toUpperCase()} /></div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-meta"><span>{product.notes}</span><span>${product.price}</span></div>
        <button className="add-button" type="button" onClick={() => onAdd(product)} aria-label={`Add ${product.name} to bag`}>+</button>
      </div>
    </article>
  );
}

function CartDrawer({ cart, isOpen, onClose, onRemove, onCheckout }) {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return <>
    <aside className={`cart-drawer ${isOpen ? 'open' : ''}`} aria-label="Shopping bag" aria-hidden={!isOpen}>
      <div className="cart-header"><h2>Your bag <span>({count})</span></h2><button className="close-button" type="button" onClick={onClose} aria-label="Close shopping bag">×</button></div>
      <div className="cart-items">
        {cart.length === 0 ? <p className="empty-cart">Your bag is waiting for something wonderful.</p> : cart.map((item) => <div className="cart-line" key={item.id}><div className="mini-visual"><div className="mini-bottle" /></div><div className="cart-line-info"><strong>{item.name}</strong><small>{item.notes}<br />${item.price} · Qty {item.quantity}</small></div><button className="remove-item" type="button" onClick={() => onRemove(item.id)}>Remove</button></div>)}
      </div>
      <div className="cart-footer"><div><span>Subtotal</span><strong>${total}</strong></div><button className="button button-dark checkout" type="button" onClick={onCheckout} disabled={!cart.length}>Checkout <span>↗</span></button></div>
    </aside>
    {isOpen && <div className="overlay open" onClick={onClose} />}
  </>;
}

function App() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [subscribed, setSubscribed] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchesFilter = filter === 'all' || product.category === filter;
    const matchesSearch = `${product.name} ${product.notes}`.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  }), [filter, search]);

  function addToCart(product) {
    setCart((current) => current.some((item) => item.id === product.id)
      ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...current, { ...product, quantity: 1 }]);
    setCartOpen(true);
  }

  function removeFromCart(id) { setCart((current) => current.filter((item) => item.id !== id)); }
  function submitNewsletter(event) { event.preventDefault(); setSubscribed(true); event.currentTarget.reset(); }
  function submitOrder(event) { event.preventDefault(); setOrderPlaced(true); }
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return <>
    <div className="announcement">Complimentary delivery on orders over $100 <span aria-hidden="true">✦</span> Crafted in small batches</div>
    <header className="site-header"><a className="brand" href="#top" aria-label="Aster and Moss home">aster <i>&</i> moss</a><nav className="main-nav" aria-label="Main navigation"><a href="#shop">Shop</a><a href="#story">Our story</a><a href="#journal">Journal</a></nav><div className="header-actions"><button className="icon-button" type="button" onClick={() => setSearchOpen((open) => !open)} aria-label="Open search">⌕</button><button className="bag-button" type="button" onClick={() => setCartOpen(true)} aria-label="Open shopping bag">Bag <span>{cartCount}</span></button></div></header>
    {searchOpen && <div className="search-panel open"><input autoFocus type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search scents..." aria-label="Search scents" /><button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search">×</button></div>}
    <main id="top">
      <section className="hero" aria-labelledby="hero-title"><div className="hero-copy"><p className="eyebrow">The new collection / 04</p><h1 id="hero-title">Find your<br /><em>signature.</em></h1><p className="hero-text">Fragrance made for the in-between moments. Unexpected notes, considered ingredients, and a little room to make it yours.</p><a className="button button-dark" href="#shop">Explore scents <span>↗</span></a></div><div className="hero-art" aria-label="A perfume bottle on a warm coral background"><div className="sun-disc" /><div className="bottle bottle-large"><div className="bottle-cap" /><div className="bottle-label">ASTER<br /><small>& MOSS</small></div></div><span className="art-note note-one">No. 04</span><span className="art-note note-two">Eau de parfum</span></div><div className="hero-stamp">Made for<br /><strong>your mood</strong><br /><span>✳</span></div></section>
      <section className="ticker" aria-label="Brand values"><div>COMPOSED WITH INTENTION</div><span>✦</span><div>SKIN-FIRST FORMULAS</div><span>✦</span><div>NO SHORTCUTS</div><span>✦</span><div>COMPOSED WITH INTENTION</div></section>
      <section className="shop-section" id="shop" aria-labelledby="shop-title"><div className="section-heading"><div><p className="eyebrow">The collection</p><h2 id="shop-title">A scent for<br /><em>every version</em> of you.</h2></div><p className="section-intro">Four original fragrances, each with its own point of view. Wear them alone or layer them into something entirely yours.</p></div><div className="shop-toolbar"><div className="filter-tabs" role="group" aria-label="Filter products">{['all', 'floral', 'woody', 'fresh'].map((option) => <button key={option} className={`filter ${filter === option ? 'active' : ''}`} type="button" onClick={() => setFilter(option)}>{option === 'all' ? 'All scents' : option[0].toUpperCase() + option.slice(1)}</button>)}</div><span className="product-count">{visibleProducts.length} scents</span></div><div className="product-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} onAdd={addToCart} />)}</div></section>
      <section className="story-section" id="story"><div className="story-image"><div className="story-bottle" /></div><div className="story-copy"><p className="eyebrow">The Aster & Moss way</p><h2>Good fragrance<br />should feel like<br /><em>coming home.</em></h2><p>We believe perfume is personal punctuation. A pause. A feeling you can return to. Every Aster & Moss scent is blended in small batches with thoughtful ingredients and no unnecessary noise.</p><a className="text-link" href="#journal">Read our story <span>↗</span></a></div></section>
      <section className="journal-section" id="journal"><div className="journal-heading"><div><p className="eyebrow">From the journal</p><h2>Notes on<br /><em>the good stuff.</em></h2></div><a className="text-link" href="#journal">View all notes <span>↗</span></a></div><div className="journal-grid"><article><div className="journal-photo photo-one" /><p className="article-type">Rituals / 05.04.24</p><h3>How to make a fragrance last all day</h3></article><article><div className="journal-photo photo-two" /><p className="article-type">Ingredients / 18.03.24</p><h3>Inside the world of skin-close musk</h3></article><article><div className="journal-photo photo-three" /><p className="article-type">Point of view / 02.02.24</p><h3>Why your best scent might be a little strange</h3></article></div></section>
      <section className="newsletter"><div><p className="eyebrow">Stay close</p><h2>A little beauty<br />in your inbox.</h2></div><form onSubmit={submitNewsletter}><label htmlFor="email">Sign up for first access, notes from the studio, and 10% off your first order.</label><div className="email-row"><input id="email" type="email" placeholder="Your email address" required /><button className="button button-dark" type="submit">Sign me up <span>↗</span></button></div><p className="form-message" aria-live="polite">{subscribed ? 'You are on the list. Welcome in.' : ''}</p></form></section>
    </main>
    <CartDrawer cart={cart} isOpen={cartOpen} onClose={() => setCartOpen(false)} onRemove={removeFromCart} onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }} />
    {checkoutOpen && <div className="checkout-overlay"><section className="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title"><button className="close-button checkout-close" type="button" onClick={() => setCheckoutOpen(false)} aria-label="Close checkout">×</button>{orderPlaced ? <div className="order-success"><span className="success-mark">✓</span><p className="eyebrow">Order received</p><h2>Thank you for your order.</h2><p>We have your request and will contact you shortly to confirm delivery and payment.</p><button className="button button-dark" type="button" onClick={() => { setCheckoutOpen(false); setCart([]); setOrderPlaced(false); }}>Continue shopping <span>↗</span></button></div> : <><p className="eyebrow">Almost yours</p><h2 id="checkout-title">Complete your<br /><em>order.</em></h2><form className="checkout-form" onSubmit={submitOrder}><label>Full name<input name="name" type="text" placeholder="Your full name" required /></label><label>Email address<input name="email" type="email" placeholder="you@example.com" required /></label><label>Delivery address<textarea name="address" placeholder="Street, city, country" rows="3" required /></label><div className="checkout-summary"><span>{cartCount} item{cartCount === 1 ? '' : 's'}</span><strong>${cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}</strong></div><button className="button button-dark checkout-submit" type="submit">Place order <span>↗</span></button></form></>}</section></div>}
  </>;
}

export default App;
