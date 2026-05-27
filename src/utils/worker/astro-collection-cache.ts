// src/lib/collections.ts
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

let _blogPosts: CollectionEntry<'blog'>[] | undefined;
let _products: CollectionEntry<'products'>[] | undefined;

export async function getBlogPosts() {
  _blogPosts ??= await getCollection('blog');
  return _blogPosts;
}

export async function getProducts() {
  _products ??= await getCollection('products');
  return _products;
}
