export type BlockType =
  | 'hero'
  | 'heading'
  | 'paragraph'
  | 'button'
  | 'image'
  | 'divider'
  | 'features'
  | 'testimonial'
  | 'cta-banner'
  | 'faq'
  | 'pricing'
  | 'video'
  | 'newsletter'
  | 'gallery'
  | 'form'
  | 'code';

export interface Block {
  id: string;
  type: BlockType;
  props: Record<string, any>;
}

export interface PaletteItem {
  type: BlockType;
  label: string;
  icon: string;
  category: string;
  defaultProps: Record<string, any>;
  pro?: boolean;
}

// Props whose values are edited inline in the canvas via contenteditable
export const INLINE_PROPS = new Set([
  'heading', 'subheading', 'text', 'ctaText', 'quote', 'author', 'role',
]);

export const PALETTE: PaletteItem[] = [
  {
    type: 'hero',
    label: 'Hero',
    icon: '⭐',
    category: 'Sections',
    defaultProps: {
      heading: 'Build Something Amazing',
      subheading: 'The fastest way to create stunning landing pages that convert.',
      ctaText: 'Get Started Free',
      ctaUrl: '#',
      bgColor: '#0f172a',
      headingColor: '#ffffff',
      subheadingColor: '#94a3b8',
      ctaBgColor: '#6366f1',
      ctaTextColor: '#ffffff',
    },
  },
  {
    type: 'features',
    label: 'Features',
    icon: '◨',
    category: 'Sections',
    defaultProps: {
      heading: 'Everything you need',
      bgColor: '#f8fafc',
      headingColor: '#1e293b',
    },
  },
  {
    type: 'testimonial',
    label: 'Testimonial',
    icon: '❝',
    category: 'Sections',
    defaultProps: {
      quote: "This product has completely transformed how our team works. We've seen 3x productivity gains.",
      author: 'Sarah Johnson',
      role: 'CEO at TechCorp',
      bgColor: '#ffffff',
      quoteColor: '#1e293b',
      authorColor: '#1e293b',
      roleColor: '#64748b',
    },
  },
  {
    type: 'cta-banner',
    label: 'CTA Banner',
    icon: '★',
    category: 'Sections',
    defaultProps: {
      heading: 'Ready to get started?',
      subheading: 'Join thousands of teams already using our platform.',
      ctaText: 'Start for Free',
      ctaUrl: '#',
      bgColor: '#6366f1',
    },
  },
  {
    type: 'heading',
    label: 'Heading',
    icon: 'H',
    category: 'Content',
    defaultProps: {
      text: 'Section Heading',
      level: 'h2',
      color: '#1e293b',
      align: 'center',
      size: '2.5rem',
    },
  },
  {
    type: 'paragraph',
    label: 'Text',
    icon: 'T',
    category: 'Content',
    defaultProps: {
      text: 'Add your content here. Click to edit and customize this text block.',
      color: '#475569',
      align: 'left',
      size: '1rem',
    },
  },
  {
    type: 'button',
    label: 'Button',
    icon: '⬡',
    category: 'Content',
    defaultProps: {
      text: 'Click Me',
      url: '#',
      bgColor: '#6366f1',
      textColor: '#ffffff',
      align: 'center',
    },
  },
  {
    type: 'image',
    label: 'Image',
    icon: '🖼',
    category: 'Content',
    defaultProps: {
      src: '',
      alt: 'Image description',
      borderRadius: '8px',
    },
  },
  {
    type: 'divider',
    label: 'Divider',
    icon: '—',
    category: 'Content',
    defaultProps: {
      color: '#e2e8f0',
      thickness: '1px',
    },
  },
  {
    type: 'faq',
    label: 'FAQ',
    icon: '❓',
    category: 'Sections',
    pro: true,
    defaultProps: {
      heading: 'Frequently Asked Questions',
      bgColor: '#f8fafc',
      headingColor: '#1e293b',
      q1: 'What is your refund policy?',
      a1: 'We offer a 30-day money-back guarantee on all plans.',
      q2: 'Do you offer discounts for teams?',
      a2: 'Yes! We have special pricing for teams of 5 or more.',
      q3: 'Can I cancel anytime?',
      a3: 'Absolutely. No lock-in contracts, cancel anytime.',
    },
  },
  {
    type: 'pricing',
    label: 'Pricing',
    icon: '💰',
    category: 'Sections',
    pro: true,
    defaultProps: {
      heading: 'Simple, transparent pricing',
      bgColor: '#fff',
      headingColor: '#1e293b',
      plan1: 'Free',
      price1: '$0',
      plan2: 'Pro',
      price2: '$12',
      plan3: 'Agency',
      price3: '$49',
      ctaUrl: '#',
      ctaBgColor: '#6366f1',
    },
  },
  {
    type: 'video',
    label: 'Video',
    icon: '▶',
    category: 'Content',
    defaultProps: {
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      caption: '',
    },
  },
  {
    type: 'newsletter',
    label: 'Newsletter',
    icon: '✉',
    category: 'Sections',
    defaultProps: {
      heading: 'Stay in the loop',
      subheading: 'Get the latest updates delivered to your inbox.',
      bgColor: '#0f172a',
      headingColor: '#ffffff',
      subheadingColor: '#94a3b8',
      ctaBgColor: '#6366f1',
      buttonText: 'Subscribe',
    },
  },
  {
    type: 'gallery',
    label: 'Gallery',
    icon: '🖼',
    category: 'Content',
    pro: true,
    defaultProps: {
      img1: '',
      img2: '',
      img3: '',
      img4: '',
      img5: '',
      img6: '',
      borderRadius: '8px',
    },
  },
  {
    type: 'form',
    label: 'Contact Form',
    icon: '📝',
    category: 'Sections',
    pro: true,
    defaultProps: {
      heading: 'Get in touch',
      subheading: "We'll get back to you within 24 hours.",
      bgColor: '#ffffff',
      headingColor: '#1e293b',
      ctaBgColor: '#6366f1',
      buttonText: 'Send message',
    },
  },
  {
    type: 'code',
    label: 'Custom HTML',
    icon: '</>',
    category: 'Content',
    pro: true,
    defaultProps: {
      html: '<p style="padding:20px;background:#f1f5f9;border-radius:8px;font-family:monospace;color:#475569;">Custom HTML block — edit the HTML prop to insert anything.</p>',
    },
  },
];

export function toEmbedUrl(url: string): string {
  // youtube.com/watch?v=ID or with extra params
  const watch = url.match(/(?:youtube\.com\/watch\?(?:.*&)?v=)([^&]+)/);
  if (watch) return `https://www.youtube.com/embed/${watch[1]}`;
  // youtu.be/ID
  const short = url.match(/youtu\.be\/([^?&]+)/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  return url;
}

export function generateBlockHtml(block: Block): string {
  const { id, type, props } = block;
  const safeProps = JSON.stringify(props).replace(/"/g, '&quot;');
  const attrs = `data-block-id="${id}" data-block-type="${type}" data-props="${safeProps}"`;

  switch (type) {
    case 'hero':
      return `<section ${attrs} class="block block-hero" style="background:${props['bgColor']};padding:100px 40px;text-align:center;">
  <div style="max-width:720px;margin:0 auto;">
    <h1 data-editable data-field="heading" style="color:${props['headingColor']};font-size:3.5rem;font-weight:800;line-height:1.1;margin:0 0 20px;letter-spacing:-1px;">${props['heading']}</h1>
    <p data-editable data-field="subheading" style="color:${props['subheadingColor']};font-size:1.25rem;line-height:1.7;margin:0 0 40px;">${props['subheading']}</p>
    <a href="${props['ctaUrl']}" data-editable data-field="ctaText" style="background:${props['ctaBgColor']};color:${props['ctaTextColor']};padding:16px 40px;border-radius:8px;text-decoration:none;font-weight:600;font-size:1.1rem;display:inline-block;">${props['ctaText']}</a>
  </div>
</section>`;

    case 'heading':
      return `<div ${attrs} class="block block-heading" style="padding:40px 40px 20px;text-align:${props['align']};">
  <${props['level']} data-editable data-field="text" style="color:${props['color']};font-size:${props['size']};font-weight:700;margin:0;letter-spacing:-0.5px;">${props['text']}</${props['level']}>
</div>`;

    case 'paragraph':
      return `<div ${attrs} class="block block-paragraph" style="padding:12px 40px;">
  <p data-editable data-field="text" style="color:${props['color']};font-size:${props['size']};text-align:${props['align']};line-height:1.75;margin:0;">${props['text']}</p>
</div>`;

    case 'button':
      return `<div ${attrs} class="block block-button" style="padding:24px 40px;text-align:${props['align']};">
  <a href="${props['url']}" data-editable data-field="text" style="background:${props['bgColor']};color:${props['textColor']};padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:600;font-size:1rem;display:inline-block;">${props['text']}</a>
</div>`;

    case 'image':
      return `<div ${attrs} class="block block-image" style="padding:24px 40px;">
  <div data-img-container style="background:#e2e8f0;border-radius:${props['borderRadius']};width:100%;min-height:220px;display:flex;align-items:center;justify-content:center;overflow:hidden;">
    ${props['src']
      ? `<img src="${props['src']}" alt="${props['alt']}" style="width:100%;height:auto;border-radius:${props['borderRadius']};display:block;">`
      : `<span style="color:#94a3b8;font-size:0.9rem;font-family:-apple-system,sans-serif;">📷 Add an image URL in the properties panel</span>`
    }
  </div>
</div>`;

    case 'divider':
      return `<div ${attrs} class="block block-divider" style="padding:32px 40px;">
  <hr style="border:none;border-top:${props['thickness']} solid ${props['color']};margin:0;">
</div>`;

    case 'features':
      return `<section ${attrs} class="block block-features" style="background:${props['bgColor']};padding:80px 40px;">
  <h2 data-editable data-field="heading" style="text-align:center;font-size:2rem;font-weight:700;color:${props['headingColor']};margin:0 0 56px;letter-spacing:-0.5px;">${props['heading']}</h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:32px;max-width:960px;margin:0 auto;">
    <div style="text-align:center;padding:32px 24px;background:#fff;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
      <div style="font-size:2.5rem;margin:0 0 16px;">⚡</div>
      <h3 style="font-size:1.125rem;font-weight:600;color:#1e293b;margin:0 0 12px;">Lightning Fast</h3>
      <p style="color:#64748b;line-height:1.6;margin:0;font-size:0.95rem;">Optimized for speed and performance out of the box.</p>
    </div>
    <div style="text-align:center;padding:32px 24px;background:#fff;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
      <div style="font-size:2.5rem;margin:0 0 16px;">🎨</div>
      <h3 style="font-size:1.125rem;font-weight:600;color:#1e293b;margin:0 0 12px;">Beautiful Design</h3>
      <p style="color:#64748b;line-height:1.6;margin:0;font-size:0.95rem;">Professionally designed templates that look great.</p>
    </div>
    <div style="text-align:center;padding:32px 24px;background:#fff;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
      <div style="font-size:2.5rem;margin:0 0 16px;">🔒</div>
      <h3 style="font-size:1.125rem;font-weight:600;color:#1e293b;margin:0 0 12px;">Secure by Default</h3>
      <p style="color:#64748b;line-height:1.6;margin:0;font-size:0.95rem;">Enterprise-grade security built into every layer.</p>
    </div>
  </div>
</section>`;

    case 'testimonial':
      return `<section ${attrs} class="block block-testimonial" style="background:${props['bgColor']};padding:80px 40px;">
  <div style="max-width:640px;margin:0 auto;text-align:center;">
    <div style="font-size:3rem;color:#6366f1;line-height:1;margin:0 0 24px;">❝</div>
    <p data-editable data-field="quote" style="font-size:1.375rem;color:${props['quoteColor']};line-height:1.65;font-style:italic;margin:0 0 32px;">${props['quote']}</p>
    <div style="width:48px;height:3px;background:#6366f1;margin:0 auto 24px;border-radius:2px;"></div>
    <p data-editable data-field="author" style="font-weight:700;color:${props['authorColor']};margin:0 0 4px;font-size:1rem;">${props['author']}</p>
    <p data-editable data-field="role" style="color:${props['roleColor']};font-size:0.875rem;margin:0;">${props['role']}</p>
  </div>
</section>`;

    case 'cta-banner':
      return `<section ${attrs} class="block block-cta-banner" style="background:${props['bgColor']};padding:80px 40px;text-align:center;">
  <div style="max-width:640px;margin:0 auto;">
    <h2 data-editable data-field="heading" style="font-size:2.5rem;font-weight:800;color:#ffffff;margin:0 0 16px;letter-spacing:-0.5px;">${props['heading']}</h2>
    <p data-editable data-field="subheading" style="font-size:1.125rem;color:rgba(255,255,255,0.8);margin:0 0 40px;line-height:1.6;">${props['subheading']}</p>
    <a href="${props['ctaUrl']}" data-editable data-field="ctaText" style="background:#ffffff;color:${props['bgColor']};padding:16px 40px;border-radius:8px;text-decoration:none;font-weight:700;font-size:1.1rem;display:inline-block;">${props['ctaText']}</a>
  </div>
</section>`;

    case 'faq':
      return `<section ${attrs} class="block block-faq" style="background:${props['bgColor']};padding:80px 40px;">
  <div style="max-width:720px;margin:0 auto;">
    <h2 style="text-align:center;font-size:2rem;font-weight:700;color:${props['headingColor']};margin:0 0 48px;letter-spacing:-0.5px;">${props['heading']}</h2>
    <style>
      .faq-details{border-bottom:1px solid #e2e8f0;padding:16px 0;cursor:pointer;}
      .faq-details summary{font-weight:600;list-style:none;display:flex;justify-content:space-between;align-items:center;color:${props['headingColor']};font-size:1rem;line-height:1.5;}
      .faq-details summary::-webkit-details-marker{display:none;}
      .faq-details summary::after{content:"+";font-size:1.25rem;color:#6366f1;flex-shrink:0;margin-left:16px;}
      .faq-details[open] summary::after{content:"-";}
      .faq-details p{margin:12px 0 4px;color:#475569;line-height:1.7;font-size:0.95rem;}
    </style>
    <details class="faq-details">
      <summary>${props['q1']}</summary>
      <p>${props['a1']}</p>
    </details>
    <details class="faq-details">
      <summary>${props['q2']}</summary>
      <p>${props['a2']}</p>
    </details>
    <details class="faq-details">
      <summary>${props['q3']}</summary>
      <p>${props['a3']}</p>
    </details>
  </div>
</section>`;

    case 'pricing':
      return `<section ${attrs} class="block block-pricing" style="background:${props['bgColor']};padding:80px 40px;">
  <h2 style="text-align:center;font-size:2rem;font-weight:700;color:${props['headingColor']};margin:0 0 56px;letter-spacing:-0.5px;">${props['heading']}</h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;max-width:900px;margin:0 auto;">
    <div style="border:1.5px solid #e2e8f0;border-radius:16px;padding:32px 24px;text-align:center;background:#fff;">
      <div style="font-size:1rem;font-weight:600;color:#64748b;margin-bottom:12px;">${props['plan1']}</div>
      <div style="font-size:3rem;font-weight:800;color:#1e293b;line-height:1;">${props['price1']}</div>
      <div style="font-size:0.85rem;color:#94a3b8;margin-bottom:24px;">/mo</div>
      <ul style="list-style:none;padding:0;margin:0 0 32px;text-align:left;font-size:0.9rem;color:#475569;line-height:2;">
        <li>&#10003; 5 pages</li><li>&#10003; Basic blocks</li><li>&#10003; Export HTML</li><li style="color:#cbd5e1;">&#10007; Custom domain</li>
      </ul>
      <a href="${props['ctaUrl']}" style="display:block;background:#f1f5f9;color:#1e293b;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.9rem;">Get started</a>
    </div>
    <div style="border:2px solid ${props['ctaBgColor']};border-radius:16px;padding:32px 24px;text-align:center;background:#fff;box-shadow:0 8px 30px rgba(99,102,241,0.15);transform:translateY(-4px);">
      <div style="font-size:1rem;font-weight:600;color:${props['ctaBgColor']};margin-bottom:12px;">${props['plan2']}</div>
      <div style="font-size:3rem;font-weight:800;color:#1e293b;line-height:1;">${props['price2']}</div>
      <div style="font-size:0.85rem;color:#94a3b8;margin-bottom:24px;">/mo</div>
      <ul style="list-style:none;padding:0;margin:0 0 32px;text-align:left;font-size:0.9rem;color:#475569;line-height:2;">
        <li>&#10003; 50 pages</li><li>&#10003; All blocks</li><li>&#10003; Export HTML</li><li>&#10003; Custom domain</li>
      </ul>
      <a href="${props['ctaUrl']}" style="display:block;background:${props['ctaBgColor']};color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.9rem;">Get started</a>
    </div>
    <div style="border:1.5px solid #e2e8f0;border-radius:16px;padding:32px 24px;text-align:center;background:#fff;">
      <div style="font-size:1rem;font-weight:600;color:#64748b;margin-bottom:12px;">${props['plan3']}</div>
      <div style="font-size:3rem;font-weight:800;color:#1e293b;line-height:1;">${props['price3']}</div>
      <div style="font-size:0.85rem;color:#94a3b8;margin-bottom:24px;">/mo</div>
      <ul style="list-style:none;padding:0;margin:0 0 32px;text-align:left;font-size:0.9rem;color:#475569;line-height:2;">
        <li>&#10003; Unlimited pages</li><li>&#10003; All blocks</li><li>&#10003; Export HTML</li><li>&#10003; White label</li>
      </ul>
      <a href="${props['ctaUrl']}" style="display:block;background:#f1f5f9;color:#1e293b;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.9rem;">Get started</a>
    </div>
  </div>
</section>`;

    case 'video':
      return `<div ${attrs} class="block block-video" style="padding:40px;">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;">
    <iframe src="${toEmbedUrl(props['url'])}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" allowfullscreen></iframe>
  </div>
  ${props['caption'] ? `<p style="text-align:center;color:#94a3b8;font-size:0.875rem;margin:12px 0 0;">${props['caption']}</p>` : ''}
</div>`;

    case 'newsletter':
      return `<section ${attrs} class="block block-newsletter" style="background:${props['bgColor']};padding:80px 40px;text-align:center;">
  <div style="max-width:560px;margin:0 auto;">
    <h2 style="font-size:2rem;font-weight:700;color:${props['headingColor']};margin:0 0 12px;letter-spacing:-0.5px;">${props['heading']}</h2>
    <p style="color:${props['subheadingColor']};font-size:1.05rem;line-height:1.7;margin:0 0 32px;">${props['subheading']}</p>
    <form onsubmit="return false" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
      <input type="email" placeholder="Enter your email" style="flex:1;min-width:200px;padding:12px 16px;border:2px solid rgba(255,255,255,0.15);border-radius:8px;font-size:0.95rem;background:rgba(255,255,255,0.08);color:${props['headingColor']};outline:none;">
      <button type="submit" style="background:${props['ctaBgColor']};color:#fff;border:none;padding:12px 28px;border-radius:8px;font-size:0.95rem;font-weight:600;cursor:pointer;white-space:nowrap;">${props['buttonText']}</button>
    </form>
  </div>
</section>`;

    case 'gallery': {
      const br = props['borderRadius'] || '8px';
      const cells = [1,2,3,4,5,6].map((i: number) => {
        const src = props[`img${i}`];
        return `<div data-gi="${i}">${src
          ? `<img src="${src}" style="width:100%;height:200px;object-fit:cover;border-radius:${br};">`
          : `<div style="background:#e2e8f0;height:200px;border-radius:${br};display:flex;align-items:center;justify-content:center;font-size:1.5rem;">&#128444;</div>`
        }</div>`;
      }).join('');
      return `<div ${attrs} class="block block-gallery" style="padding:40px;">
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
    ${cells}
  </div>
</div>`;
    }

    case 'form':
      return `<section ${attrs} class="block block-form" style="background:${props['bgColor']};padding:80px 40px;">
  <div style="max-width:560px;margin:0 auto;">
    <h2 style="font-size:2rem;font-weight:700;color:${props['headingColor']};margin:0 0 8px;letter-spacing:-0.5px;">${props['heading']}</h2>
    <p style="color:#64748b;font-size:1rem;line-height:1.6;margin:0 0 32px;">${props['subheading']}</p>
    <form onsubmit="return false" style="display:flex;flex-direction:column;gap:16px;">
      <input type="text" placeholder="Your name" style="border:2px solid #e2e8f0;border-radius:8px;padding:12px 16px;font-size:0.95rem;width:100%;box-sizing:border-box;outline:none;font-family:inherit;">
      <input type="email" placeholder="Email address" style="border:2px solid #e2e8f0;border-radius:8px;padding:12px 16px;font-size:0.95rem;width:100%;box-sizing:border-box;outline:none;font-family:inherit;">
      <textarea rows="4" placeholder="Your message" style="border:2px solid #e2e8f0;border-radius:8px;padding:12px 16px;font-size:0.95rem;width:100%;box-sizing:border-box;resize:vertical;outline:none;font-family:inherit;"></textarea>
      <button type="submit" style="background:${props['ctaBgColor']};color:#fff;border:none;padding:14px 32px;border-radius:8px;font-size:1rem;font-weight:600;cursor:pointer;align-self:flex-start;">${props['buttonText']}</button>
    </form>
  </div>
</section>`;

    case 'code':
      return `<div ${attrs} class="block block-code" style="padding:16px 40px;">${props['html']}</div>`;

    default:
      return `<div ${attrs} class="block" style="padding:20px 40px;"><p>Unknown block: ${type}</p></div>`;
  }
}
