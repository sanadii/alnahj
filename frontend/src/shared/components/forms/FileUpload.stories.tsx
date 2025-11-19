import type { Meta, StoryObj } from '@storybook/react';
import FileUpload from './FileUpload';
import { Box, Stack } from '@mui/material';

const meta: Meta<typeof FileUpload> = {
  title: 'Shared/Forms/FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text for the file upload.'
    },
    accept: {
      control: 'text',
      description: 'Accepted file types (e.g., "image/*", ".pdf,.doc").'
    },
    multiple: {
      control: 'boolean',
      description: 'Whether to allow multiple file selection.'
    },
    maxFiles: {
      control: 'number',
      description: 'Maximum number of files allowed.'
    },
    maxSize: {
      control: 'number',
      description: 'Maximum file size in MB.'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the upload is disabled.'
    },
    required: {
      control: 'boolean',
      description: 'Whether the upload is required.'
    },
    error: {
      control: 'boolean',
      description: 'Whether the upload has an error.'
    },
    helperText: {
      control: 'text',
      description: 'Helper text to display below the upload.'
    },
    variant: {
      control: 'select',
      options: ['dropzone', 'button', 'compact'],
      description: 'Visual style variant.'
    },
    showPreview: {
      control: 'boolean',
      description: 'Whether to show file preview list.'
    },
    showProgress: {
      control: 'boolean',
      description: 'Whether to show upload progress.'
    },
    onFilesChange: {
      action: 'files changed',
      description: 'Callback when files are added or removed.'
    },
    onFileRemove: {
      action: 'file removed',
      description: 'Callback when a file is removed.'
    }
  },
  args: {
    label: 'Upload Files',
    accept: '*/*',
    multiple: true,
    maxFiles: 5,
    maxSize: 10,
    variant: 'dropzone',
    showPreview: true,
    showProgress: false
  }
};

export default meta;

type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {
  args: {
    label: 'Upload Files'
  }
};

export const SingleFile: Story = {
  args: {
    label: 'Upload Single File',
    multiple: false,
    maxFiles: 1
  }
};

export const ImagesOnly: Story = {
  args: {
    label: 'Upload Images',
    accept: 'image/*',
    maxFiles: 3,
    maxSize: 5
  }
};

export const DocumentsOnly: Story = {
  args: {
    label: 'Upload Documents',
    accept: '.pdf,.doc,.docx,.txt',
    maxFiles: 3,
    maxSize: 20
  }
};

export const ButtonVariant: Story = {
  args: {
    label: 'Choose Files',
    variant: 'button'
  }
};

export const CompactVariant: Story = {
  args: {
    variant: 'compact'
  }
};

export const WithProgress: Story = {
  args: {
    label: 'Upload with Progress',
    showProgress: true
  }
};

export const Required: Story = {
  args: {
    label: 'Required Upload',
    required: true
  }
};

export const WithError: Story = {
  args: {
    label: 'Upload with Error',
    error: true,
    helperText: 'Please upload at least one file'
  }
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Upload',
    disabled: true
  }
};

export const LargeFiles: Story = {
  args: {
    label: 'Upload Large Files',
    maxSize: 100,
    maxFiles: 2
  }
};

export const ManyFiles: Story = {
  args: {
    label: 'Upload Many Files',
    maxFiles: 10,
    maxSize: 5
  }
};

export const FormExample: Story = {
  render: () => (
    <Box sx={{ maxWidth: 600, p: 2 }}>
      <Stack spacing={3}>
        <FileUpload label="Profile Picture" accept="image/*" multiple={false} maxFiles={1} maxSize={5} required />
        <FileUpload label="Documents" accept=".pdf,.doc,.docx" multiple={true} maxFiles={5} maxSize={20} variant="button" />
        <FileUpload label="Additional Files" variant="compact" maxFiles={3} maxSize={10} />
      </Stack>
    </Box>
  )
};
