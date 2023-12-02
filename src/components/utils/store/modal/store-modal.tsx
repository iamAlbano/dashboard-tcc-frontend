"use client";
import { notify } from "@/components/utils/toast";
import { useAccessibility } from "@/context/accessibility";
import { useStore } from "@/context/store";
import { useUser } from "@/context/user";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { useEffect, useState } from "react";

export default function CreateStoreModal() {
  const [storeName, setStoreName] = useState("");
  const [addingStore, setAddingStore] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user_id } = useUser();
  const { getDict } = useAccessibility();
  const dict = getDict();
  const {
    stores,
    setStores,
    createStore,
    selectedStore,
    setSelectedStore,
    openedCreateModal,
    setOpenedCreateModal,
    getUserStores,
  } = useStore();

  const handleGetStores = async () => {
    if (!user_id) {
      setStores([]);
      return;
    }
    const res = await getUserStores(user_id);

    if (res?.status === 200 && res?.data?.stores?.length)
      setStores(res.data.stores);
    else {
      setStores([]);
      setOpenedCreateModal(true);
    }
  };

  const handleAddStore = async () => {
    if (!storeName || !user_id) return;

    setLoading(true);
    const res = await createStore(storeName, [user_id]);

    if (res?.status === 201 && res?.data?.store?.id) {
      notify(dict.store.createSuccessMessage, "success");
      setStoreName("");
      setAddingStore(false);
      setOpenedCreateModal(false);
      setSelectedStore(res.data.store);
      setStores(stores.concat(res.data.store));
    } else notify(dict.errorMessage, "error");
    setLoading(false);
  };

  useEffect(() => {
    handleGetStores();
  }, [user_id]);

  return (
    <Dialog
      header={dict.store.title}
      visible={openedCreateModal}
      style={{ width: "80vw" }}
      onHide={() => setOpenedCreateModal(false)}
    >
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>{dict.store.storeName}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {!stores?.length && !addingStore && !loading && (
            <tr className="text-center">
              <td className="p-5">{dict.store.noStoreMessage}</td>
            </tr>
          )}
          {stores.map((store) => (
            <tr key={store.id}>
              <td>{store.name}</td>
              <td className="text-right">
                <Button
                  icon={selectedStore?.id === store.id ? "pi pi-check" : ""}
                  label={dict.select}
                  disabled={loading || selectedStore?.id === store.id}
                  outlined={selectedStore?.id === store.id}
                  onClick={() => {
                    setSelectedStore(store);
                  }}
                />
              </td>
            </tr>
          ))}
          {loading && (
            <tr>
              <td colSpan={2}>
                <Skeleton height="50px" />
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          {!addingStore && !loading && (
            <tr>
              <td className="text-center" colSpan={2}>
                <i
                  className="pi pi-plus-circle text-primary cursor-pointer text-lg"
                  onClick={() => setAddingStore(true)}
                />
              </td>
            </tr>
          )}
          {addingStore && !loading && (
            <tr>
              <td>
                <InputText
                  value={storeName}
                  placeholder={dict.store.storeName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setStoreName(e.target.value)
                  }
                />
              </td>
              <td>
                <span className="w-full flex flex-row justify-content-end gap-3">
                  <Button
                    label={dict.create}
                    onClick={() => handleAddStore()}
                    severity="success"
                    icon="pi pi-check"
                  />
                  <Button
                    label={dict.cancel}
                    onClick={() => setAddingStore(false)}
                    icon="pi pi-times"
                    severity="danger"
                    outlined
                  />
                </span>
              </td>
            </tr>
          )}
        </tfoot>
      </table>
    </Dialog>
  );
}
