export type BlockType =
  | 'hero'
  | 'heading'
  | 'paragraph'
  | 'button'
  | 'image'
  | 'divider'
  | 'features'
  | 'testimonial'
  | 'cta-banner';

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
];

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

    default:
      return `<div ${attrs} class="block" style="padding:20px 40px;"><p>Unknown block: ${type}</p></div>`;
  }
}
