import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { apiFetch, assetUrl, type ApiResult } from '../../api/client'
import type { Article } from '../../types'
export function ArticleDetailPage(){const {slug}=useParams();const q=useQuery({queryKey:['article',slug],queryFn:()=>apiFetch<ApiResult<Article>>(`/public/articles/${slug}`),enabled:!!slug});if(q.isLoading)return <div className="center-screen">Memuat artikel...</div>;if(q.isError||!q.data)return <div className="center-screen">Artikel tidak ditemukan.</div>;const a=q.data.data;return <article className="article-detail container page-top"><Link to="/artikel">← Kembali ke artikel</Link><span className="eyebrow">ARTIKEL</span><h1>{a.title}</h1><p className="lead">{a.excerpt}</p>{a.cover_image_url&&<img className="detail-cover" src={assetUrl(a.cover_image_url)} alt={a.title}/>}<div className="prose">{(a.content||'').split('\n').map((p,i)=><p key={i}>{p}</p>)}</div></article>}
