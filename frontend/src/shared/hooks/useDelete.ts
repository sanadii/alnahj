import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';

const useDelete = (deleteAction: any) => {
  const dispatch = useDispatch();

  const [deleteModalMulti, setDeleteModalMulti] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState<any[]>([]);

  const onClickDelete = (item: any) => {
    setItemToDelete(item);
    setDeleteModal(true);
  };

  const handleDeleteItem = () => {
    if (itemToDelete) {
      dispatch(deleteAction(itemToDelete.id));
      setDeleteModal(false);
    }
  };

  const checkedAll = useCallback(() => {
    const checkall = document.getElementById('checkBoxAll') as HTMLInputElement;
    const checkedEntries = document.querySelectorAll('.checkboxSelector') as NodeListOf<HTMLInputElement>;
    if (checkall && checkall.checked) {
      checkedEntries.forEach((entry) => {
        entry.checked = true;
      });
    } else if (checkall) {
      checkedEntries.forEach((entry) => {
        entry.checked = false;
      });
    }
    deleteCheckbox();
  }, []);

  const deleteCheckbox = () => {
    const checkedEntry = document.querySelectorAll('.checkboxSelector:checked');
    checkedEntry.length > 0 ? setIsMultiDeleteButton(true) : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(Array.from(checkedEntry));
  };

  const deleteMultiple = () => {
    const checkall = document.getElementById('checkBoxAll') as HTMLInputElement;
    selectedCheckBoxDelete.forEach((element: any) => {
      dispatch(deleteAction(element.value));
    });
    setIsMultiDeleteButton(false);
    if (checkall) {
      checkall.checked = false;
    }
  };

  return {
    // Basic delete actions
    handleDeleteItem,
    onClickDelete,

    // Modals
    setDeleteModal,
    deleteModal,
    setDeleteModalMulti,
    deleteModalMulti,

    // Checkbox related
    checkedAll,
    deleteCheckbox,

    // Multi-delete actions
    deleteMultiple,
    isMultiDeleteButton
  };
};

export { useDelete };
