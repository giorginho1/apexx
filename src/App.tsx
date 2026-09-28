import { FormEvent, useEffect, useState } from 'react';
import {
  ArrowRight,
  Award,
  BriefcaseBusiness,
  Building2,
  Check,
  Clock3,
  Gavel,
  Globe2,
  Handshake,
  Instagram,
  Linkedin,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Phone,
  Scale,
  ShieldCheck,
  Sparkles,
  Star,
  UserCircle2,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';

type Page = 'home' | 'quem-somos' | 'atuacao' | 'civil' | 'penal' | 'trabalhista' | 'imobiliario' | 'digital' | 'outras' | 'artigos' | 'avaliacoes' | 'contato' | 'entrar';

type Service = {
  slug: Page;
  number: string;
  title: string;
  description: string;
  icon: typeof Scale;
};

const services: Service[] = [
  { slug: 'civil', number: '01', title: 'Direito Civil', description: 'Contratos, responsabilidade, família e patrimônio tratados com clareza e estratégia.', icon: Scale },
  { slug: 'penal', number: '02', title: 'Direito Penal & Criminal', description: 'Atuação técnica, firme e discreta em todas as fases da persecução penal.', icon: Gavel },
  { slug: 'trabalhista', number: '03', title: 'Direito Trabalhista', description: 'Relações de trabalho mais seguras para empresas e profissionais.', icon: BriefcaseBusiness },
  { slug: 'imobiliario', number: '04', title: 'Direito Imobiliário', description: 'Segurança jurídica para comprar, vender, construir e investir.', icon: MapPin },
  { slug: 'digital', number: '05', title: 'Digital & LGPD', description: 'Privacidade, dados e negócios digitais preparados para o presente.', icon: Globe2 },
  { slug: 'outras', number: '06', title: 'Empresarial & Tributário', description: 'Estrutura, crescimento e decisões financeiras com segurança jurídica.', icon: Building2 },
];

const articles = [
  { category: 'Estratégia', date: '12 set 2024', title: 'Por que prevenir conflitos é uma decisão de negócio', excerpt: 'A advocacia consultiva transforma incerteza em clareza antes que o problema chegue ao Judiciário.' },
  { category: 'Contratos', date: '28 ago 2024', title: 'Contratos que protegem relações, não apenas assinaturas', excerpt: 'Os pontos essenciais para um contrato cumprir seu papel e acompanhar a realidade da operação.' },
  { category: 'Privacidade', date: '05 ago 2024', title: 'LGPD na prática: o primeiro passo para pequenas empresas', excerpt: 'Um caminho objetivo para organizar dados, responsabilidades e confiança com clientes.' },
];

const allPages: Page[] = ['home', 'quem-somos', 'atuacao', 'civil', 'penal', 'trabalhista', 'imobiliario', 'digital', 'outras', 'artigos', 'avaliacoes', 'contato', 'entrar'];

function getPage(): Page {
  const path = window.location.pathname.replace(/^\//, '') as Page;
  return allPages.includes(path) ? path : 'home';
}

function App() {
  const [page, setPage] = useState<Page>(getPage);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onPopState = () => setPage(getPage());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (nextPage: Page) => {
    window.history.pushState({}, '', nextPage === 'home' ? '/' : `/${nextPage}`);
    setPage(nextPage);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="site-shell">
      <Header page={page} onNavigate={navigate} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main>
        {page === 'home' && <Home onNavigate={navigate} />}
        {page === 'quem-somos' && <About onNavigate={navigate} />}
        {page === 'atuacao' && <Practice onNavigate={navigate} />}
        {services.filter((service) => service.slug === page).map((service) => <ServicePage key={service.slug} service={service} onNavigate={navigate} />)}
        {page === 'artigos' && <Articles onNavigate={navigate} />}
        {page === 'avaliacoes' && <Reviews onNavigate={navigate} />}
        {page === 'contato' && <Contact />}
        {page === 'entrar' && <Auth onNavigate={navigate} />}
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
}

function Header({ page, onNavigate, menuOpen, setMenuOpen }: { page: Page; onNavigate: (page: Page) => void; menuOpen: boolean; setMenuOpen: (open: boolean) => void }) {
  const { user, signOut } = useAuth();
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <button className="brand" onClick={() => onNavigate('home')} aria-label="Apex Advocacia - início">
          <span className="brand-mark"><Sparkles size={17} strokeWidth={1.8} /></span>
          <span><strong>APEX</strong><small>ADVOCACIA</small></span>
        </button>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu">{menuOpen ? <X /> : <Menu />}</button>
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`}>
          <button className={page === 'home' ? 'active' : ''} onClick={() => onNavigate('home')}>Início</button>
          <button className={page === 'quem-somos' ? 'active' : ''} onClick={() => onNavigate('quem-somos')}>Quem somos</button>
          <button className={['atuacao', 'civil', 'penal', 'trabalhista', 'imobiliario', 'digital', 'outras'].includes(page) ? 'active' : ''} onClick={() => onNavigate('atuacao')}>Atuação</button>
          <button className={page === 'artigos' ? 'active' : ''} onClick={() => onNavigate('artigos')}>Artigos</button>
          <button className={page === 'avaliacoes' ? 'active' : ''} onClick={() => onNavigate('avaliacoes')}>Avaliações</button>
          {user ? (
            <button className="nav-user" onClick={() => signOut()}><UserCircle2 size={16} /> Sair</button>
          ) : (
            <button className={page === 'entrar' ? 'active nav-user-link' : 'nav-user-link'} onClick={() => onNavigate('entrar')}><UserCircle2 size={16} /> Entrar</button>
          )}
          <button className="nav-cta" onClick={() => onNavigate('contato')}>Fale conosco <ArrowRight size={15} /></button>
        </nav>
      </div>
    </header>
  );
}

function Eyebrow({ children }: { children: string }) { return <p className="eyebrow"><span />{children}</p>; }

function Home({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return <>
    <section className="hero">
      <div className="hero-grid" />
      <div className="hero-content page-width">
        <div className="hero-copy">
          <Eyebrow>Advocacia estratégica</Eyebrow>
          <h1>Decisões mais seguras para <em>caminhos</em> mais livres.</h1>
          <p>Atuação jurídica próxima, técnica e inteligente para proteger o que importa e abrir espaço para o que vem depois.</p>
          <div className="hero-actions"><button className="button button-primary" onClick={() => onNavigate('contato')}>Agende uma conversa <ArrowRight size={17} /></button><button className="text-link" onClick={() => onNavigate('atuacao')}>Conheça nossa atuação <ArrowRight size={16} /></button></div>
        </div>
        <div className="hero-aside"><div className="seal"><ShieldCheck size={30} /><span>Confiança<br /><b>em cada detalhe</b></span></div><div className="hero-note">"O direito deve ser um lugar de clareza, não de medo."</div></div>
      </div>
      <div className="hero-footer page-width"><span>São Paulo · Brasil</span><span>01 — 05</span></div>
    </section>
    <section className="intro section page-width"><div className="intro-label">Apex<br />em uma frase</div><div><h2>Estratégia jurídica<br /><em>com presença humana.</em></h2><p className="lead">Problemas complexos pedem mais do que respostas prontas. Na Apex, unimos profundidade técnica, visão de negócio e uma relação verdadeiramente próxima.</p><button className="text-link" onClick={() => onNavigate('quem-somos')}>Conheça a Apex <ArrowRight size={16} /></button></div></section>
    <section className="services-preview section"><div className="page-width"><div className="section-heading"><div><Eyebrow>Como podemos ajudar</Eyebrow><h2>Conhecimento que<br /><em>move você adiante.</em></h2></div><button className="circle-arrow" onClick={() => onNavigate('atuacao')} aria-label="Ver áreas de atuação"><ArrowRight /></button></div><div className="service-grid">{services.slice(0, 3).map((service) => <ServiceCard key={service.slug} service={service} onNavigate={onNavigate} />)}</div></div></section>
    <section className="statement page-width"><div className="statement-line" /><p>Direito feito de <em>precisão</em>,<br />presença e propósito.</p><div className="statement-meta"><Award size={20} /><span>Atuação que combina<br />técnica e sensibilidade</span></div></section>
    <section className="home-cta"><div className="page-width home-cta-inner"><div><Eyebrow>Vamos conversar</Eyebrow><h2>Seu próximo passo<br /><em>começa com clareza.</em></h2></div><button className="button button-light" onClick={() => onNavigate('contato')}>Fale com a nossa equipe <ArrowRight size={17} /></button></div></section>
  </>;
}

function About({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return <>
    <section className="inner-hero"><div className="page-width inner-hero-content"><Eyebrow>Quem somos</Eyebrow><h1>Uma banca feita para<br /><em>ir além do óbvio.</em></h1><p>A Apex nasceu da convicção de que o melhor trabalho jurídico acontece quando conhecimento e escuta caminham juntos.</p></div><div className="inner-hero-number">A/02</div></section>
    <section className="about-body section page-width"><div className="about-lead"><span className="large-initial">A</span><h2>Presença que<br /><em>faz diferença.</em></h2></div><div className="about-copy"><p className="lead">Somos uma equipe de advogados que acredita em relações duradouras, linguagem acessível e soluções que fazem sentido no mundo real.</p><p>Nosso trabalho começa entendendo o contexto. Depois, transformamos cenários jurídicos complexos em escolhas mais simples, conscientes e alinhadas ao que realmente importa para cada cliente.</p><button className="button button-primary" onClick={() => onNavigate('contato')}>Conheça nosso jeito de trabalhar <ArrowRight size={17} /></button></div></section>
    <section className="history-section"><div className="page-width history-grid"><div><Eyebrow>Nossa história</Eyebrow><h2>Experiência que<br /><em>se renova.</em></h2></div><div className="history-copy"><p className="lead">A Apex foi fundada em 2014 por Ana Martins e Pedro Xavier, dois advogados que compartilhavam uma inquietação: tornar o direito mais próximo, estratégico e compreensível.</p><p>Começamos com uma pequena equipe e uma grande atenção aos detalhes. Hoje, seguimos independentes, próximos e comprometidos com o mesmo princípio: cada cliente merece uma advocacia pensada para o seu contexto.</p><div className="timeline"><span>2014</span><span>Fundação da Apex em São Paulo</span><span>2024</span><span>Uma década de relações construídas</span></div></div></div></section>
    <section className="founders-section section page-width"><div className="section-heading"><div><Eyebrow>Sócios fundadores</Eyebrow><h2>Gente por trás<br /><em>da estratégia.</em></h2></div><p className="founders-intro">Profissionais com repertório técnico, escuta ativa e uma visão compartilhada sobre o papel da advocacia.</p></div><div className="founders-grid"><div className="founder-card"><div className="founder-monogram">AM</div><h3>Ana Martins</h3><p>Sócia fundadora · OAB/SP 000.000</p><span>Direito Civil e Empresarial</span></div><div className="founder-card"><div className="founder-monogram monogram-dark">PX</div><h3>Pedro Xavier</h3><p>Sócio fundador · OAB/SP 000.000</p><span>Direito Penal e Trabalhista</span></div></div></section>
    <section className="purpose-section"><div className="page-width"><Eyebrow>Propósito & valores</Eyebrow><div className="purpose-grid"><div><h2>O direito como<br /><em>força construtiva.</em></h2><p>Existimos para dar segurança às decisões que movimentam pessoas, negócios e futuros.</p></div><div className="purpose-cards"><Value icon={<Handshake />} title="Missão" text="Oferecer orientação jurídica precisa, humana e responsável para decisões mais seguras." /><Value icon={<Sparkles />} title="Visão" text="Ser referência em uma advocacia contemporânea, acessível e estrategicamente próxima." /><Value icon={<ShieldCheck />} title="Compromisso ético" text="Atuar com independência, sigilo, transparência e respeito às pessoas e às instituições." /></div></div></div></section>
  </>;
}

function Value({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) { return <div className="value"><div className="value-icon">{icon}</div><h3>{title}</h3><p>{text}</p></div>; }

function Practice({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return <><section className="inner-hero practice-hero"><div className="page-width inner-hero-content"><Eyebrow>Áreas de atuação</Eyebrow><h1>Experiência para<br /><em>cada cenário.</em></h1><p>Escolha o caminho que mais se aproxima do seu momento. A nossa equipe está pronta para olhar o todo.</p></div><div className="inner-hero-number">A/03</div></section><section className="practice-list page-width">{services.map((service) => <ServiceCard key={service.slug} service={service} onNavigate={onNavigate} large />)}</section><section className="soft-cta"><div className="page-width"><h2>Não encontrou o que procura?</h2><p>Áreas diferentes também podem exigir uma visão integrada. Conte o seu caso para nós.</p><button className="text-link" onClick={() => onNavigate('contato')}>Fale com a equipe <ArrowRight size={16} /></button></div></section></>;
}

function ServiceCard({ service, onNavigate, large = false }: { service: Service; onNavigate: (page: Page) => void; large?: boolean }) { return <button className={`service-card ${large ? 'service-card-large' : ''}`} onClick={() => onNavigate(service.slug)}><div className="service-top"><span>{service.number}</span><service.icon size={large ? 26 : 21} /></div><h3>{service.title}</h3><p>{service.description}</p><span className="service-arrow"><ArrowRight size={17} /></span></button>; }

function ServicePage({ service, onNavigate }: { service: Service; onNavigate: (page: Page) => void }) {
  const details: Record<string, { intro: string; bullets: string[] }> = {
    civil: { intro: 'A vida pessoal e empresarial é feita de acordos. Nós ajudamos você a construir relações mais claras e protegidas.', bullets: ['Contratos e negociações', 'Responsabilidade civil', 'Direito de família e sucessões', 'Recuperação de crédito'] },
    penal: { intro: 'Em momentos sensíveis, experiência e serenidade fazem toda a diferença. Atuamos com estratégia e discrição.', bullets: ['Defesa em inquéritos e ações penais', 'Crimes empresariais', 'Medidas cautelares', 'Acompanhamento em delegacias'] },
    trabalhista: { intro: 'Segurança nas relações de trabalho para que pessoas e empresas possam evoluir com mais confiança.', bullets: ['Consultoria preventiva', 'Defesas e reclamações trabalhistas', 'Acordos e negociações coletivas', 'Compliance trabalhista'] },
    imobiliario: { intro: 'Patrimônio é projeto de vida. Cuidamos de cada detalhe jurídico para que seus investimentos tenham bases sólidas.', bullets: ['Compra e venda de imóveis', 'Due diligence imobiliária', 'Locação e condomínios', 'Incorporação e regularização'] },
    digital: { intro: 'A inovação pede novas perguntas. Protegemos dados, reputação e negócios no ambiente digital.', bullets: ['Adequação à LGPD', 'Políticas de privacidade', 'Contratos de tecnologia', 'Incidentes e resposta'] },
    outras: { intro: 'Estrutura e crescimento pedem escolhas bem fundamentadas. Apoiamos empresas em decisões que exigem visão ampla.', bullets: ['Estruturação empresarial', 'Governança e acordos societários', 'Planejamento tributário', 'Contencioso estratégico'] },
  };
  const detail = details[service.slug];
  return <><section className="inner-hero service-hero"><div className="page-width inner-hero-content"><Eyebrow>Área de atuação · {service.number}</Eyebrow><div className="service-title-row"><h1>{service.title}<br /><em>com estratégia.</em></h1><div className="service-hero-icon"><service.icon /></div></div><p>{detail.intro}</p></div><div className="inner-hero-number">A/{service.number}</div></section><section className="service-detail page-width"><div><Eyebrow>Como atuamos</Eyebrow><h2>O detalhe certo<br /><em>muda tudo.</em></h2></div><div><p className="lead">Cada caso tem uma história, um ritmo e uma consequência. Por isso, nosso trabalho combina análise cuidadosa com orientação direta.</p><ul className="check-list">{detail.bullets.map((bullet) => <li key={bullet}><span><Check size={15} /></span>{bullet}</li>)}</ul><button className="button button-primary" onClick={() => onNavigate('contato')}>Converse com um especialista <ArrowRight size={17} /></button></div></section><section className="related page-width"><Eyebrow>Também podemos ajudar</Eyebrow><div className="related-links">{services.filter((item) => item.slug !== service.slug).slice(0, 3).map((item) => <button key={item.slug} onClick={() => onNavigate(item.slug)}>{item.title}<ArrowRight size={16} /></button>)}</div></section></>;
}

function Articles({ onNavigate }: { onNavigate: (page: Page) => void }) { return <><section className="inner-hero articles-hero"><div className="page-width inner-hero-content"><Eyebrow>Artigos & ideias</Eyebrow><h1>Clareza para<br /><em>decidir melhor.</em></h1><p>Análises e conversas sobre direito, negócios e as escolhas que movem a vida.</p></div><div className="inner-hero-number">A/09</div></section><section className="articles-section page-width"><div className="featured-article"><span className="article-label">Em destaque · Estratégia</span><h2>O direito como<br /><em>ferramenta de futuro.</em></h2><p>Mais do que resolver problemas, a boa advocacia ajuda a enxergar oportunidades e construir relações mais duradouras.</p><button className="text-link" onClick={() => onNavigate('contato')}>Converse sobre o seu cenário <ArrowRight size={16} /></button></div><div className="article-list">{articles.map((article, index) => <article key={article.title} className="article-card"><div className="article-meta"><span>0{index + 1}</span><span>{article.category} · {article.date}</span></div><h3>{article.title}</h3><p>{article.excerpt}</p><button className="article-read">Ler análise <ArrowRight size={15} /></button></article>)}</div></section></>; }

type Review = {
  id: string;
  author_name: string;
  rating: number;
  service: string;
  title: string;
  comment: string;
  approved: boolean;
  created_at: string;
};

function Reviews({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const loadReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('reviews').select('id, author_name, rating, service, title, comment, approved, created_at').order('created_at', { ascending: false });
    if (!error && data) setReviews(data as Review[]);
    setLoading(false);
  };

  useEffect(() => { loadReviews(); }, []);

  const approvedReviews = reviews.filter((r) => r.approved);
  const avgRating = approvedReviews.length > 0 ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length : 0;

  return <><section className="inner-hero reviews-hero"><div className="page-width inner-hero-content"><Eyebrow>Avaliações de clientes</Eyebrow><h1>Quem confiou,<br /><em>quem recomenda.</em></h1><p>A opinião de quem já contratou a Apex é o nosso termômetro mais sincero. Aqui, avaliações reais de clientes registrados.</p></div><div className="inner-hero-number">A/11</div></section>
    <section className="reviews-summary page-width">
      <div className="summary-card">
        <div className="summary-big">{avgRating > 0 ? avgRating.toFixed(1) : '—'}</div>
        <div className="summary-stars">{avgRating > 0 && renderStars(Math.round(avgRating))}</div>
        <span>{approvedReviews.length} avaliação{approvedReviews.length !== 1 ? 'ões' : ''} aprovada{approvedReviews.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="summary-cta">
        <div><h2>Já foi nosso cliente?<br /><em>Deixe sua avaliação.</em></h2><p>Sua opinião ajuda outras pessoas a tomarem decisões mais seguras.</p></div>
        {user ? (
          <button className="button button-primary" onClick={() => setShowForm(!showForm)}>{showForm ? 'Fechar formulário' : 'Avaliar agora'} <ArrowRight size={17} /></button>
        ) : (
          <button className="button button-primary" onClick={() => onNavigate('entrar')}>Entrar para avaliar <ArrowRight size={17} /></button>
        )}
      </div>
    </section>
    {user && showForm && <ReviewForm onSubmitted={() => { setShowForm(false); loadReviews(); }} />}
    <section className="reviews-list-section page-width">
      <div className="section-heading"><div><Eyebrow>O que dizem</Eyebrow><h2>Experiências<br /><em>compartilhadas.</em></h2></div></div>
      {loading ? <p className="reviews-empty">Carregando avaliações...</p> : approvedReviews.length === 0 ? <p className="reviews-empty">Ainda não há avaliações aprovadas. Seja o primeiro a compartilhar sua experiência.</p> : <div className="reviews-list">{approvedReviews.map((review) => <ReviewCard key={review.id} review={review} />)}</div>}
      {user && reviews.filter((r) => !r.approved).length > 0 && <div className="pending-note"><Clock3 size={16} /><span>Sua avaliação foi enviada e está aguardando aprovação da nossa equipe.</span></div>}
    </section>
  </>;
}

function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, i) => <Star key={i} size={18} className={i < rating ? 'star-filled' : 'star-empty'} fill={i < rating ? 'currentColor' : 'none'} />);
}

function ReviewCard({ review }: { review: Review }) {
  return <article className="review-card">
    <div className="review-top"><div className="review-stars">{renderStars(review.rating)}</div><span className="review-service">{review.service}</span></div>
    <h3>{review.title}</h3>
    <p>{review.comment}</p>
    <div className="review-author"><span className="review-monogram">{review.author_name.charAt(0).toUpperCase()}</span><span>{review.author_name}</span></div>
  </article>;
}

function ReviewForm({ onSubmitted }: { onSubmitted: () => void }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true); setError('');
    const form = new FormData(event.currentTarget);
    const authorName = String(form.get('author_name') ?? '').trim();
    const service = String(form.get('service') ?? '').trim();
    const title = String(form.get('title') ?? '').trim();
    const comment = String(form.get('comment') ?? '').trim();
    const { error: insertError } = await supabase.from('reviews').insert({ author_name: authorName, rating, service, title, comment });
    if (insertError) setError('Não foi possível enviar agora. Tente novamente.'); else { setSuccess(true); event.currentTarget.reset(); setRating(5); }
    setSubmitting(false);
    if (!insertError) setTimeout(onSubmitted, 100);
  };

  if (success) return <div className="page-width"><div className="review-success"><div className="success-icon"><Check /></div><h2>Avaliação enviada.</h2><p>Obrigado por compartilhar sua experiência. Nossa equipe vai revisar antes de publicá-la.</p><button className="text-link" onClick={() => setSuccess(false)}>Enviar outra avaliação <ArrowRight size={16} /></button></div></div>;

  return <section className="page-width review-form-section"><div className="review-form-wrap"><h2>Compartilhe sua experiência</h2><form className="contact-form review-form" onSubmit={submit}>
    <div className="form-row">
      <label>Seu nome<input required name="author_name" defaultValue={user?.user_metadata?.name ?? ''} placeholder="Como devemos identificar você?" /></label>
      <label>Área contratada<select required name="service" defaultValue="">{services.map((s) => <option key={s.slug}>{s.title}</option>)}<option>Outro</option></select></label>
    </div>
    <div className="rating-field"><span className="rating-label">Sua nota</span><div className="star-picker">{Array.from({ length: 5 }, (_, i) => <button type="button" key={i} onClick={() => setRating(i + 1)} onMouseEnter={() => setHoverRating(i + 1)} onMouseLeave={() => setHoverRating(0)} aria-label={`${i + 1} estrela${i > 0 ? 's' : ''}`}><Star size={28} fill={i < (hoverRating || rating) ? 'currentColor' : 'none'} className={i < (hoverRating || rating) ? 'star-filled' : 'star-empty'} /></button>)}</div></div>
    <label>Título da avaliação<input required name="title" placeholder="Em poucas palavras, resuma sua experiência" /></label>
    <label>Sua opinião<textarea required name="comment" rows={5} placeholder="Conte como foi trabalhar com a Apex..."></textarea></label>
    {error && <p className="form-error">{error}</p>}
    <button className="button button-primary" disabled={submitting}>{submitting ? 'Enviando...' : 'Enviar avaliação'} <ArrowRight size={17} /></button>
  </form></div></section>;
}

function Auth({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { user, signIn, signUp, signOut } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true); setError('');
    const result = mode === 'signin' ? await signIn(email, password) : await signUp(email, password, name);
    if (result.error) setError(result.error);
    else { onNavigate('avaliacoes'); }
    setLoading(false);
  };

  if (user) return <><section className="inner-hero auth-hero"><div className="page-width inner-hero-content"><Eyebrow>Sua conta</Eyebrow><h1>Você está<br /><em>conectado.</em></h1><p>Agora você pode deixar avaliações sobre a sua experiência com a Apex.</p></div><div className="inner-hero-number">A/12</div></section><section className="page-width auth-logged-in"><div className="auth-card"><UserCircle2 size={40} /><h2>Olá{user.user_metadata?.name ? `, ${user.user_metadata.name}` : ''}.</h2><p>Você já pode avaliar o nosso serviço.</p><div className="auth-actions"><button className="button button-primary" onClick={() => onNavigate('avaliacoes')}>Ir para avaliações <ArrowRight size={17} /></button><button className="text-link" onClick={() => signOut()}>Sair da conta <LogOut size={16} /></button></div></div></section></>;

  return <><section className="inner-hero auth-hero"><div className="page-width inner-hero-content"><Eyebrow>{mode === 'signin' ? 'Entrar' : 'Criar conta'}</Eyebrow><h1>{mode === 'signin' ? <>Bem-vindo<br /><em>de volta.</em></> : <>Crie sua<br /><em>conta.</em></>}</h1><p>{mode === 'signin' ? 'Acesse para deixar avaliações sobre a sua experiência com a Apex.' : 'Registre-se para compartilhar sua experiência como cliente da Apex.'}</p></div><div className="inner-hero-number">A/12</div></section><section className="page-width auth-section"><div className="auth-form-wrap"><div className="auth-tabs"><button className={mode === 'signin' ? 'active' : ''} onClick={() => { setMode('signin'); setError(''); }}>Entrar</button><button className={mode === 'signup' ? 'active' : ''} onClick={() => { setMode('signup'); setError(''); }}>Criar conta</button></div><form className="contact-form auth-form" onSubmit={submit}>{mode === 'signup' && <label>Seu nome<input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Como podemos chamar você?" /></label>}<label>E-mail<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" /></label><label>Senha<input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" /></label>{error && <p className="form-error">{error}</p>}<button className="button button-primary" disabled={loading}>{loading ? 'Aguarde...' : mode === 'signin' ? 'Entrar' : 'Criar conta'} <ArrowRight size={17} /></button></form><p className="auth-switch">{mode === 'signin' ? 'Ainda não tem conta? ' : 'Já tem conta? '}<button onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}>{mode === 'signin' ? 'Criar agora' : 'Entrar'}</button></p></div></section></>;
}

function Contact() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true); setError('');
    const form = new FormData(event.currentTarget);
    const payload = { name: String(form.get('name') ?? '').trim(), email: String(form.get('email') ?? '').trim(), phone: String(form.get('phone') ?? '').trim(), interest: String(form.get('interest') ?? '').trim(), message: String(form.get('message') ?? '').trim() };
    const { error: insertError } = await supabase.from('contact_submissions').insert(payload);
    if (insertError) setError('Não foi possível enviar agora. Tente novamente ou fale conosco por telefone.'); else { setSent(true); event.currentTarget.reset(); }
    setSending(false);
  };
  return <><section className="inner-hero contact-hero"><div className="page-width inner-hero-content"><Eyebrow>Fale conosco</Eyebrow><h1>Vamos começar<br /><em>uma conversa.</em></h1><p>Conte um pouco sobre o seu momento. A nossa equipe retorna em até um dia útil.</p></div><div className="inner-hero-number">A/10</div></section><section className="contact-section page-width"><div className="contact-info"><Eyebrow>Estamos por perto</Eyebrow><h2>Uma boa conversa<br /><em>abre caminhos.</em></h2><div className="contact-details"><a href="tel:+551130455500"><Phone size={18} /> +55 11 3045 5500</a><a href="mailto:contato@apex.adv.br"><Mail size={18} /> contato@apex.adv.br</a><span><MapPin size={18} /> Rua Harmonia, 797 · Vila Madalena<br />São Paulo, SP</span></div><div className="office-note"><Clock3 size={18} /><span>Atendimento<br /><b>Seg a Sex · 9h às 18h</b></span></div></div><div className="contact-form-wrap">{sent ? <div className="success-message"><div className="success-icon"><Check /></div><h2>Mensagem recebida.</h2><p>Obrigado por confiar na Apex. Em breve, nossa equipe entra em contato com você.</p><button className="text-link" onClick={() => setSent(false)}>Enviar outra mensagem <ArrowRight size={16} /></button></div> : <form className="contact-form" onSubmit={submit}><div className="form-row"><label>Seu nome<input required name="name" placeholder="Como podemos chamar você?" /></label><label>E-mail<input required type="email" name="email" placeholder="voce@email.com" /></label></div><div className="form-row"><label>Telefone <span>(opcional)</span><input name="phone" placeholder="(11) 00000-0000" /></label><label>Área de interesse<select required name="interest" defaultValue=""><option value="" disabled>Selecione uma área</option>{services.map((service) => <option key={service.slug}>{service.title}</option>)}<option>Outro assunto</option></select></label></div><label>Como podemos ajudar?<textarea required name="message" rows={5} placeholder="Conte brevemente o que você precisa..."></textarea></label>{error && <p className="form-error">{error}</p>}<button className="button button-primary" disabled={sending}>{sending ? 'Enviando...' : 'Enviar mensagem'} <ArrowRight size={17} /></button><p className="form-privacy">Ao enviar, você concorda com o nosso cuidado no tratamento dos seus dados.</p></form>}</div></section><section className="map-strip"><iframe title="Mapa da localização da Apex Advocacia" src="https://www.google.com/maps?q=Rua+Harmonia,+797,+Vila+Madalena,+São+Paulo&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /><div className="map-overlay"><MapPin size={23} /><div><strong>Vila Madalena, São Paulo</strong><span>Um espaço para conversas importantes.</span></div></div></section></>;
}

function Footer({ onNavigate }: { onNavigate: (page: Page) => void }) { return <footer className="footer"><div className="page-width footer-top"><div><button className="brand footer-brand" onClick={() => onNavigate('home')}><span className="brand-mark"><Sparkles size={17} /></span><span><strong>APEX</strong><small>ADVOCACIA</small></span></button><p>Direito com clareza,<br />presença e propósito.</p></div><div className="footer-nav"><span>Explorar</span><button onClick={() => onNavigate('quem-somos')}>Quem somos</button><button onClick={() => onNavigate('atuacao')}>Áreas de atuação</button><button onClick={() => onNavigate('artigos')}>Artigos</button><button onClick={() => onNavigate('avaliacoes')}>Avaliações</button></div><div className="footer-nav"><span>Contato</span><a href="mailto:contato@apex.adv.br">contato@apex.adv.br</a><a href="tel:+551130455500">+55 11 3045 5500</a><div className="socials"><a href="https://www.linkedin.com" aria-label="LinkedIn"><Linkedin size={17} /></a><a href="https://www.instagram.com" aria-label="Instagram"><Instagram size={17} /></a></div></div></div><div className="page-width footer-bottom"><span>© 2024 Apex Advocacia. Todos os direitos reservados.</span><span>Feito com cuidado em São Paulo.</span></div></footer>; }

export default App;
